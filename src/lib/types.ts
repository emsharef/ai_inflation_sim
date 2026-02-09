export type ScenarioId = 'baseline' | 'conservative' | 'moderate' | 'transformative';
export type HorizonId = '1yr' | '3yr' | '10yr';
export type Confidence = 'high' | 'medium' | 'low';
export type HierarchyLevel = 0 | 1 | 2;

export interface CpiComponent {
  id: string;
  name: string;
  seriesId: string;
  weight: number; // Dec 2024 relative importance (percentage of total CPI)
  currentRate: number; // Dec 2025 12-month percent change (YoY)
  parentId: string | null;
  level: HierarchyLevel; // 0=major group, 1=expenditure class, 2=item stratum
  children: string[];
}

export interface AiImpactModifier {
  componentId: string;
  scenario: ScenarioId;
  horizon: HorizonId;
  inflationImpactPp: number; // change in annualized inflation rate (pp)
  weightShiftPp: number; // change in CPI weight (pp)
  confidence: Confidence;
  explanation: string;
  citations: string[]; // citation IDs
}

export interface Scenario {
  id: ScenarioId;
  name: string;
  subtitle: string;
  description: string;
  color: string;
  tenYrProductivity: string;
  tenYrCpiImpact: string;
  alignedWith: string;
  keyAssumptions: string[];
}

export interface ResearchCitation {
  id: string;
  shortName: string;
  authors: string;
  title: string;
  year: number;
  source: string;
  url: string;
  keyFindings: string[];
  summary: string;
}

export interface ProjectionResult {
  componentId: string;
  baselineRate: number; // current trend rate
  projectedRate: number; // after AI impact
  aiImpactPp: number;
  adjustedWeight: number;
  originalWeight: number;
  weightShiftPp: number;
}

export interface AggregateProjection {
  baselineCpi: number;
  projectedCpi: number;
  totalAiImpactPp: number;
  componentResults: ProjectionResult[];
}

export interface BlsDataPoint {
  year: number;
  period: string;
  value: number;
  seriesId: string;
}

export interface ComponentTreeNode extends CpiComponent {
  childNodes: ComponentTreeNode[];
  modifier: AiImpactModifier | null;
  projection: ProjectionResult | null;
}
