'use client';

import { useMemo } from 'react';
import { ScenarioId, HorizonId } from '@/lib/types';
import { scenarios } from '@/data/scenarios';
import { calculateAggregateProjection } from '@/lib/calculations';
import { formatPp } from '@/lib/formatters';

interface ScenarioCardProps {
  scenarioId: ScenarioId;
  horizon: HorizonId;
  isActive?: boolean;
  onClick?: () => void;
}

export default function ScenarioCard({ scenarioId, horizon, isActive, onClick }: ScenarioCardProps) {
  const s = scenarios[scenarioId];
  const projection = useMemo(
    () => calculateAggregateProjection(scenarioId, horizon),
    [scenarioId, horizon]
  );

  return (
    <div
      onClick={onClick}
      className={`border rounded-md p-4 transition-all cursor-pointer ${
        isActive
          ? 'border-opacity-60'
          : 'border-[#2a2a3a] hover:border-[#3a3a4a]'
      }`}
      style={isActive ? { borderColor: s.color, backgroundColor: s.color + '08' } : { backgroundColor: '#13131d' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
        <h3 className="text-sm font-medium" style={{ color: s.color }}>{s.name}</h3>
      </div>
      <p className="text-[10px] text-[#606070] mb-3">{s.subtitle}</p>

      {/* Key metrics */}
      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <span className="text-[10px] text-[#606070]">Projected CPI</span>
          <span className="text-sm font-bold tabular-nums" style={{ color: s.color }}>
            {projection.projectedCpi.toFixed(2)}%
          </span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-[10px] text-[#606070]">AI Impact</span>
          <span className={`text-sm font-bold tabular-nums ${projection.totalAiImpactPp < 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {formatPp(projection.totalAiImpactPp)}
          </span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-[10px] text-[#606070]">10yr Productivity</span>
          <span className="text-xs text-[#9898aa]">{s.tenYrProductivity}</span>
        </div>
      </div>

      {/* Key assumptions */}
      <div className="mt-3 pt-3 border-t border-[#2a2a3a]">
        <div className="text-[9px] uppercase text-[#606070] mb-1.5">Key Assumptions</div>
        <ul className="space-y-0.5">
          {s.keyAssumptions.slice(0, 3).map((a, i) => (
            <li key={i} className="text-[10px] text-[#9898aa] flex items-start gap-1">
              <span className="text-[#606070] mt-0.5">·</span>
              {a}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
