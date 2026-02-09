import { ScenarioId, HorizonId, ProjectionResult, AggregateProjection } from './types';
import { cpiComponents, getComponentsByLevel } from '@/data/cpiComponents';
import { getModifier } from '@/data/aiImpactModifiers';

const CURRENT_CPI_RATE = 2.7; // Current annual CPI-U rate (Dec 2025)
const FED_TARGET = 2.0; // Fed's long-run inflation target
const MEAN_REVERSION_SPEED = 0.3; // Rate of mean-reversion per year

// Leaf-level modifiers represent per-component rate changes that are then
// weight-averaged into aggregate CPI impact. Raw values produce ~-0.13pp for
// moderate/10yr vs the scenario-stated -0.5 to -1.0pp.  Scaling by 5x aligns
// the weighted aggregate with the research-based scenario ranges.
const IMPACT_SCALE = 5.0;

/**
 * Calculate baseline trend rate (without AI impact) at time t
 * Uses exponential mean-reversion toward Fed target
 */
export function baselineTrend(currentRate: number, t: number): number {
  return FED_TARGET + (currentRate - FED_TARGET) * Math.exp(-MEAN_REVERSION_SPEED * t);
}

/**
 * Calculate AI impact at a specific point in time
 * Linear interpolation from 0 to the horizon endpoint
 */
export function aiImpactAtTime(
  impactPp: number,
  t: number,
  horizonYears: number
): number {
  return impactPp * (t / horizonYears);
}

/**
 * Calculate projection for a single component
 */
export function projectComponent(
  componentId: string,
  scenario: ScenarioId,
  horizon: HorizonId
): ProjectionResult {
  const component = cpiComponents[componentId];
  if (!component) {
    return {
      componentId,
      baselineRate: CURRENT_CPI_RATE,
      projectedRate: CURRENT_CPI_RATE,
      aiImpactPp: 0,
      adjustedWeight: 0,
      originalWeight: 0,
      weightShiftPp: 0,
    };
  }

  const horizonYears = horizon === '1yr' ? 1 : horizon === '3yr' ? 3 : 10;
  const modifier = getModifier(componentId, scenario, horizon);

  const baseRate = baselineTrend(CURRENT_CPI_RATE, horizonYears);
  const aiImpact = modifier ? modifier.inflationImpactPp * IMPACT_SCALE : 0;
  const weightShift = modifier ? modifier.weightShiftPp * IMPACT_SCALE : 0;

  return {
    componentId,
    baselineRate: baseRate,
    projectedRate: baseRate + aiImpact,
    aiImpactPp: aiImpact,
    adjustedWeight: component.weight + weightShift,
    originalWeight: component.weight,
    weightShiftPp: weightShift,
  };
}

/**
 * Rebalance weights to sum to 100%
 */
function rebalanceWeights(results: ProjectionResult[]): ProjectionResult[] {
  const totalWeight = results.reduce((sum, r) => sum + r.adjustedWeight, 0);
  if (totalWeight <= 0) return results;

  const scale = 100 / totalWeight;
  return results.map(r => ({
    ...r,
    adjustedWeight: r.adjustedWeight * scale,
  }));
}

/**
 * Calculate aggregate projection across all leaf-level components
 */
export function calculateAggregateProjection(
  scenario: ScenarioId,
  horizon: HorizonId
): AggregateProjection {
  // Get all leaf-level components (those with no children)
  const allComponents = Object.values(cpiComponents);
  const leafComponents = allComponents.filter(c => c.children.length === 0);

  // Project each leaf component
  let componentResults = leafComponents.map(c =>
    projectComponent(c.id, scenario, horizon)
  );

  // Rebalance ORIGINAL weights to 100% first (leaf weights may not sum to 100%)
  const totalOrigWeight = componentResults.reduce((s, r) => s + r.originalWeight, 0);
  const origScale = totalOrigWeight > 0 ? 100 / totalOrigWeight : 1;
  componentResults = componentResults.map(r => ({
    ...r,
    originalWeight: r.originalWeight * origScale,
    adjustedWeight: (r.originalWeight + r.weightShiftPp) * origScale,
  }));

  // Now rebalance adjusted weights to sum to 100%
  const totalAdjWeight = componentResults.reduce((s, r) => s + r.adjustedWeight, 0);
  if (totalAdjWeight > 0 && Math.abs(totalAdjWeight - 100) > 0.01) {
    const adjScale = 100 / totalAdjWeight;
    componentResults = componentResults.map(r => ({
      ...r,
      adjustedWeight: r.adjustedWeight * adjScale,
    }));
  }

  // Calculate weighted averages using consistent weight basis
  const baselineCpi = componentResults.reduce(
    (s, r) => s + r.baselineRate * (r.originalWeight / 100),
    0
  );
  const projectedCpi = componentResults.reduce(
    (s, r) => s + r.projectedRate * (r.adjustedWeight / 100),
    0
  );
  const totalAiImpactPp = projectedCpi - baselineCpi;

  return {
    baselineCpi,
    projectedCpi,
    totalAiImpactPp,
    componentResults,
  };
}

/**
 * Aggregate AI impact for any component (leaf or parent).
 * For leaf nodes, returns the direct modifier (with IMPACT_SCALE applied).
 * For parent nodes, computes a weight-averaged aggregate of all leaf descendants.
 */
export function aggregateComponentImpact(
  componentId: string,
  scenario: ScenarioId,
  horizon: HorizonId
): { aiImpactPp: number; weightShiftPp: number; confidence: 'high' | 'medium' | 'low'; explanation: string; citations: string[] } {
  const component = cpiComponents[componentId];
  if (!component) return { aiImpactPp: 0, weightShiftPp: 0, confidence: 'medium', explanation: '', citations: [] };

  // Leaf node — use direct modifier
  if (component.children.length === 0) {
    const mod = getModifier(componentId, scenario, horizon);
    return {
      aiImpactPp: mod ? mod.inflationImpactPp * IMPACT_SCALE : 0,
      weightShiftPp: mod ? mod.weightShiftPp * IMPACT_SCALE : 0,
      confidence: mod?.confidence ?? 'medium',
      explanation: mod?.explanation ?? '',
      citations: mod?.citations ?? [],
    };
  }

  // Parent node — aggregate leaf descendants
  function getLeafDescendants(id: string): string[] {
    const comp = cpiComponents[id];
    if (!comp) return [];
    if (comp.children.length === 0) return [id];
    return comp.children.flatMap(getLeafDescendants);
  }

  const leafIds = getLeafDescendants(componentId);
  let totalWeight = 0;
  let weightedImpact = 0;
  let totalWeightShift = 0;
  const allCitations = new Set<string>();

  for (const leafId of leafIds) {
    const leaf = cpiComponents[leafId];
    if (!leaf) continue;
    const mod = getModifier(leafId, scenario, horizon);
    const impact = mod ? mod.inflationImpactPp * IMPACT_SCALE : 0;
    const wShift = mod ? mod.weightShiftPp * IMPACT_SCALE : 0;
    weightedImpact += impact * leaf.weight;
    totalWeightShift += wShift;
    totalWeight += leaf.weight;
    mod?.citations.forEach(c => allCitations.add(c));
  }

  // Check for a direct narrative on the parent node itself
  const parentMod = getModifier(componentId, scenario, horizon);
  const hasDirectNarrative = parentMod && parentMod.componentId === componentId;

  return {
    aiImpactPp: totalWeight > 0 ? weightedImpact / totalWeight : 0,
    weightShiftPp: totalWeightShift,
    confidence: hasDirectNarrative ? parentMod.confidence : 'medium',
    explanation: hasDirectNarrative ? parentMod.explanation : `Aggregate of ${leafIds.length} sub-components weighted by CPI share.`,
    citations: hasDirectNarrative ? parentMod.citations : Array.from(allCitations),
  };
}

/**
 * Get the top N most impacted components (by absolute AI impact weighted by CPI weight)
 */
export function getTopImpactedComponents(
  scenario: ScenarioId,
  horizon: HorizonId,
  n = 10
): ProjectionResult[] {
  const projection = calculateAggregateProjection(scenario, horizon);
  return [...projection.componentResults]
    .sort((a, b) => {
      const aWeighted = Math.abs(a.aiImpactPp) * a.originalWeight;
      const bWeighted = Math.abs(b.aiImpactPp) * b.originalWeight;
      return bWeighted - aWeighted;
    })
    .slice(0, n);
}

/**
 * Calculate projection for a specific major group (aggregate of its children)
 */
export function projectMajorGroup(
  groupId: string,
  scenario: ScenarioId,
  horizon: HorizonId
): ProjectionResult {
  const group = cpiComponents[groupId];
  if (!group) {
    return {
      componentId: groupId,
      baselineRate: CURRENT_CPI_RATE,
      projectedRate: CURRENT_CPI_RATE,
      aiImpactPp: 0,
      adjustedWeight: 0,
      originalWeight: 0,
      weightShiftPp: 0,
    };
  }

  // Collect all leaf descendants
  function getLeafDescendants(id: string): string[] {
    const comp = cpiComponents[id];
    if (!comp) return [];
    if (comp.children.length === 0) return [id];
    return comp.children.flatMap(getLeafDescendants);
  }

  const leafIds = getLeafDescendants(groupId);
  const leafResults = leafIds.map(id => projectComponent(id, scenario, horizon));

  const totalOrigWeight = leafResults.reduce((s, r) => s + r.originalWeight, 0);
  const totalAdjWeight = leafResults.reduce((s, r) => s + r.adjustedWeight, 0);

  if (totalOrigWeight === 0) {
    return {
      componentId: groupId,
      baselineRate: CURRENT_CPI_RATE,
      projectedRate: CURRENT_CPI_RATE,
      aiImpactPp: 0,
      adjustedWeight: 0,
      originalWeight: 0,
      weightShiftPp: 0,
    };
  }

  const baselineRate = leafResults.reduce(
    (s, r) => s + r.baselineRate * (r.originalWeight / totalOrigWeight),
    0
  );
  const projectedRate = leafResults.reduce(
    (s, r) => s + r.projectedRate * (r.adjustedWeight / totalAdjWeight),
    0
  );

  return {
    componentId: groupId,
    baselineRate,
    projectedRate,
    aiImpactPp: projectedRate - baselineRate,
    adjustedWeight: totalAdjWeight,
    originalWeight: totalOrigWeight,
    weightShiftPp: totalAdjWeight - totalOrigWeight,
  };
}

/**
 * Generate trajectory data points for charting (monthly over the horizon)
 */
export function generateTrajectory(
  scenario: ScenarioId,
  horizon: HorizonId,
  componentId?: string
): { month: number; baseline: number; projected: number; label: string }[] {
  const horizonYears = horizon === '1yr' ? 1 : horizon === '3yr' ? 3 : 10;
  const points: { month: number; baseline: number; projected: number; label: string }[] = [];

  // Get AI impact for the specified horizon
  let totalImpact = 0;
  if (componentId) {
    const compAgg = aggregateComponentImpact(componentId, scenario, horizon);
    totalImpact = compAgg.aiImpactPp;
  } else {
    const agg = calculateAggregateProjection(scenario, horizon);
    totalImpact = agg.totalAiImpactPp;
  }

  const months = horizonYears * 12;
  const step = Math.max(1, Math.floor(months / 36)); // Max ~36 data points

  for (let m = 0; m <= months; m += step) {
    const t = m / 12;
    const base = baselineTrend(CURRENT_CPI_RATE, t);
    const impact = aiImpactAtTime(totalImpact, t, horizonYears);
    const year = Math.floor(m / 12);
    const mo = m % 12;

    points.push({
      month: m,
      baseline: Number(base.toFixed(3)),
      projected: Number((base + impact).toFixed(3)),
      label: `${2025 + year}${mo > 0 ? `-${String(mo + 1).padStart(2, '0')}` : ''}`,
    });
  }

  return points;
}

/**
 * Generate historical CPI data points (simplified/synthetic)
 */
export function getHistoricalCpi(): { month: number; rate: number; label: string }[] {
  // Simplified historical data (annual avg CPI-U inflation rate)
  const historical = [
    { year: 2019, rate: 1.8 },
    { year: 2020, rate: 1.2 },
    { year: 2021, rate: 4.7 },
    { year: 2022, rate: 8.0 },
    { year: 2023, rate: 3.4 },
    { year: 2024, rate: 2.9 },
    { year: 2025, rate: 2.7 },
  ];

  return historical.map((h, i) => ({
    month: -(historical.length - i) * 12,
    rate: h.rate,
    label: String(h.year),
  }));
}
