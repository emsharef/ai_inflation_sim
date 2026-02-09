'use client';

import { ScenarioId, HorizonId } from '@/lib/types';
import { cpiComponents } from '@/data/cpiComponents';
import { getModifier } from '@/data/aiImpactModifiers';
import { citations } from '@/data/researchCitations';
import { projectComponent, aggregateComponentImpact } from '@/lib/calculations';
import { formatPp, formatWeight, getImpactColor, getConfidenceColor, getHorizonLabel } from '@/lib/formatters';

interface CpiComponentCardProps {
  componentId: string;
  scenario: ScenarioId;
  horizon: HorizonId;
}

export default function CpiComponentCard({ componentId, scenario, horizon }: CpiComponentCardProps) {
  const component = cpiComponents[componentId];
  if (!component) return null;

  const isLeaf = component.children.length === 0;
  const modifier = isLeaf ? getModifier(componentId, scenario, horizon) : null;
  const agg = aggregateComponentImpact(componentId, scenario, horizon);
  const projection = projectComponent(componentId, scenario, horizon);

  // For parent nodes, use aggregated impact for display
  const displayImpact = isLeaf ? projection.aiImpactPp : agg.aiImpactPp;
  const displayWeightShift = isLeaf ? projection.weightShiftPp : agg.weightShiftPp;
  const displayProjectedRate = isLeaf ? projection.projectedRate : projection.baselineRate + agg.aiImpactPp;

  return (
    <div className="bg-[#13131d] border border-[#2a2a3a] rounded-md p-4 space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-sm font-medium text-[#e4e4ef]">{component.name}</h3>
        <div className="flex items-center gap-3 mt-1 text-[10px] text-[#606070]">
          <span>BLS: {component.seriesId}</span>
          <span>Weight: {formatWeight(component.weight)}</span>
          {!isLeaf && <span className="text-amber-500/80">Aggregated from sub-components</span>}
        </div>
      </div>

      {/* Projection numbers */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#0a0a0f] rounded p-2">
          <div className="text-[9px] uppercase text-[#606070]">Baseline Rate</div>
          <div className="text-sm font-bold tabular-nums text-[#9898aa]">
            {projection.baselineRate.toFixed(2)}%
          </div>
        </div>
        <div className="bg-[#0a0a0f] rounded p-2">
          <div className="text-[9px] uppercase text-[#606070]">With AI</div>
          <div className="text-sm font-bold tabular-nums text-[#e4e4ef]">
            {displayProjectedRate.toFixed(2)}%
          </div>
        </div>
        <div className="bg-[#0a0a0f] rounded p-2">
          <div className="text-[9px] uppercase text-[#606070]">AI Impact</div>
          <div className={`text-sm font-bold tabular-nums ${getImpactColor(displayImpact)}`}>
            {formatPp(displayImpact)}
          </div>
        </div>
      </div>

      {/* Weight shift */}
      {displayWeightShift !== 0 && (
        <div className="text-[10px]">
          <span className="text-[#606070]">Weight shift: </span>
          <span className={displayWeightShift > 0 ? 'text-amber-400' : 'text-emerald-400'}>
            {formatPp(displayWeightShift)}
          </span>
        </div>
      )}

      {/* Explanation */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] ${getConfidenceColor(agg.confidence)}`}>
            {agg.confidence.toUpperCase()} CONFIDENCE
          </span>
          <span className="text-[10px] text-[#606070]">
            {getHorizonLabel(horizon)} horizon
          </span>
        </div>
        <p className="text-xs text-[#9898aa] leading-relaxed">
          {agg.explanation}
        </p>

        {/* Citations */}
        {agg.citations.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {agg.citations.map(citId => {
              const cit = citations[citId];
              if (!cit) return null;
              return (
                <span
                  key={citId}
                  className="text-[9px] px-1.5 py-0.5 bg-[#1a1a24] border border-[#2a2a3a] rounded text-[#9898aa] cursor-default"
                  title={`${cit.authors} - ${cit.title} (${cit.year})`}
                >
                  {cit.shortName}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
