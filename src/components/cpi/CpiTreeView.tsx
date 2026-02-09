'use client';

import { useState, useMemo } from 'react';
import { ScenarioId, HorizonId } from '@/lib/types';
import { cpiComponents, getMajorGroups, getChildren } from '@/data/cpiComponents';
import { aggregateComponentImpact, projectComponent, projectMajorGroup, baselineTrend } from '@/lib/calculations';
import { formatPp, getImpactColor } from '@/lib/formatters';

interface CpiTreeViewProps {
  scenario: ScenarioId;
  horizon: HorizonId;
  onSelectComponent?: (id: string) => void;
  selectedId?: string | null;
}

interface TreeNodeProps {
  componentId: string;
  scenario: ScenarioId;
  horizon: HorizonId;
  baseRate: number;
  depth: number;
  onSelect?: (id: string) => void;
  selectedId?: string | null;
}

function TreeNode({ componentId, scenario, horizon, baseRate, depth, onSelect, selectedId }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(depth === 0);
  const component = cpiComponents[componentId];
  if (!component) return null;

  const children = getChildren(componentId);
  const hasChildren = children.length > 0;
  const agg = aggregateComponentImpact(componentId, scenario, horizon);
  const isSelected = selectedId === componentId;

  const weight = component.weight;
  const baseContrib = weight * baseRate / 100;

  // Rate effect: AI rate change × original weight
  const rateEffect = agg.aiImpactPp * (weight / 100);
  // Total contribution including weight shift
  const projRate = baseRate + agg.aiImpactPp;
  const adjWeight = weight + agg.weightShiftPp;
  const totalAiContrib = (projRate * adjWeight - baseRate * weight) / 100;
  const weightEffect = totalAiContrib - rateEffect;

  return (
    <div>
      <div
        className={`flex items-center py-1 px-1 cursor-pointer transition-colors ${
          isSelected ? 'bg-[#1a1a24] border-l-2 border-blue-500' : 'hover:bg-[#111118]'
        }`}
        onClick={() => {
          if (hasChildren) setExpanded(!expanded);
          onSelect?.(componentId);
        }}
      >
        {/* Name with indent */}
        <div className="flex items-center gap-1 min-w-0 flex-1" style={{ paddingLeft: `${depth * 12 + 4}px` }}>
          <span className="w-2.5 text-[9px] text-[#606070] flex-shrink-0">
            {hasChildren ? (expanded ? '▼' : '▶') : '·'}
          </span>
          <span className={`text-[10px] truncate ${depth === 0 ? 'font-medium text-[#e4e4ef]' : 'text-[#9898aa]'}`} title={component.name}>
            {component.name}
          </span>
        </div>

        {/* Weight */}
        <span className="text-[10px] tabular-nums text-[#606070] w-[44px] text-right flex-shrink-0">
          {weight.toFixed(1)}%
        </span>

        {/* Base Rate (CPI Growth) */}
        <span className="text-[10px] tabular-nums text-[#606070] w-[44px] text-right flex-shrink-0">
          {baseRate.toFixed(2)}%
        </span>

        {/* Base Contribution */}
        <span className="text-[10px] tabular-nums text-[#606070] w-[48px] text-right flex-shrink-0">
          {baseContrib.toFixed(3)}
        </span>

        {/* Weight Change */}
        <span className={`text-[10px] tabular-nums w-[48px] text-right flex-shrink-0 ${
          agg.weightShiftPp === 0 ? 'text-[#606070]' : agg.weightShiftPp < 0 ? 'text-orange-400' : 'text-sky-400'
        }`}>
          {agg.weightShiftPp !== 0 ? formatPp(agg.weightShiftPp, 2) : '-'}
        </span>

        {/* Rate Change (CPI Change) */}
        <span className={`text-[10px] tabular-nums w-[48px] text-right flex-shrink-0 ${getImpactColor(agg.aiImpactPp)}`}>
          {agg.aiImpactPp !== 0 ? formatPp(agg.aiImpactPp, 2) : '-'}
        </span>

        {/* AI Impact (total contribution to aggregate) */}
        <span className={`text-[10px] tabular-nums w-[54px] text-right flex-shrink-0 font-medium ${getImpactColor(totalAiContrib)}`}>
          {Math.abs(totalAiContrib) >= 0.00005 ? (totalAiContrib > 0 ? '+' : '') + totalAiContrib.toFixed(4) : '-'}
        </span>
      </div>

      {/* Children */}
      {expanded && hasChildren && (
        <div>
          {children.map(child => (
            <TreeNode
              key={child.id}
              componentId={child.id}
              scenario={scenario}
              horizon={horizon}
              baseRate={baseRate}
              depth={depth + 1}
              onSelect={onSelect}
              selectedId={selectedId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CpiTreeView({ scenario, horizon, onSelectComponent, selectedId }: CpiTreeViewProps) {
  const majorGroups = useMemo(() => getMajorGroups(), []);
  const horizonYears = horizon === '1yr' ? 1 : horizon === '3yr' ? 3 : 10;
  const baseRate = baselineTrend(2.7, horizonYears);

  return (
    <div className="bg-[#13131d] border border-[#2a2a3a] rounded-md overflow-hidden">
      {/* Column headers */}
      <div className="flex items-center px-1 py-1.5 border-b border-[#2a2a3a] bg-[#0a0a0f]">
        <div className="text-[9px] text-[#606070] font-normal flex-1 min-w-0" style={{ paddingLeft: '8px' }}>
          Component
        </div>
        <span className="text-[9px] text-[#606070] w-[44px] text-right flex-shrink-0" title="Current CPI weight">
          Wt%
        </span>
        <span className="text-[9px] text-[#606070] w-[44px] text-right flex-shrink-0" title="Baseline CPI growth rate (no AI)">
          Growth
        </span>
        <span className="text-[9px] text-[#606070] w-[48px] text-right flex-shrink-0" title="Current contribution to aggregate CPI (Wt × Growth / 100)">
          Contrib
        </span>
        <span className="text-[9px] text-[#606070] w-[48px] text-right flex-shrink-0" title="AI-driven CPI weight change (pp)">
          Wt Δ
        </span>
        <span className="text-[9px] text-[#606070] w-[48px] text-right flex-shrink-0" title="AI-driven inflation rate change (pp)">
          Rate Δ
        </span>
        <span className="text-[9px] text-[#606070] w-[54px] text-right flex-shrink-0" title="Total AI contribution to aggregate CPI change (pp)">
          AI Impct
        </span>
      </div>

      {/* Tree */}
      <div className="max-h-[600px] overflow-y-auto">
        {majorGroups.map(group => (
          <TreeNode
            key={group.id}
            componentId={group.id}
            scenario={scenario}
            horizon={horizon}
            baseRate={baseRate}
            depth={0}
            onSelect={onSelectComponent}
            selectedId={selectedId}
          />
        ))}
      </div>
    </div>
  );
}
