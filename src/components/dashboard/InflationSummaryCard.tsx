'use client';

import { useMemo } from 'react';
import { ScenarioId, HorizonId } from '@/lib/types';
import { calculateAggregateProjection } from '@/lib/calculations';
import { scenarios } from '@/data/scenarios';
import { formatPp, getHorizonLabel } from '@/lib/formatters';

interface InflationSummaryCardProps {
  scenario: ScenarioId;
  horizon: HorizonId;
}

export default function InflationSummaryCard({ scenario, horizon }: InflationSummaryCardProps) {
  const projection = useMemo(
    () => calculateAggregateProjection(scenario, horizon),
    [scenario, horizon]
  );

  const s = scenarios[scenario];
  const currentRate = 2.7;

  return (
    <div className="grid grid-cols-4 gap-3">
      {/* Current CPI */}
      <div className="bg-[#13131d] border border-[#2a2a3a] rounded-md p-4">
        <div className="text-[10px] uppercase tracking-wider text-[#606070] mb-1">
          Current CPI-U
        </div>
        <div className="text-2xl font-bold tabular-nums text-[#e4e4ef]">
          {currentRate.toFixed(1)}%
        </div>
        <div className="text-[10px] text-[#606070] mt-1">Dec 2025 YoY</div>
      </div>

      {/* Baseline (no AI) */}
      <div className="bg-[#13131d] border border-[#2a2a3a] rounded-md p-4">
        <div className="text-[10px] uppercase tracking-wider text-[#606070] mb-1">
          Baseline (No AI)
        </div>
        <div className="text-2xl font-bold tabular-nums text-[#9898aa]">
          {projection.baselineCpi.toFixed(2)}%
        </div>
        <div className="text-[10px] text-[#606070] mt-1">
          {getHorizonLabel(horizon)} mean-revert
        </div>
      </div>

      {/* Projected with AI */}
      <div
        className="border rounded-md p-4"
        style={{
          backgroundColor: scenario === 'baseline' ? '#13131d' : s.color + '10',
          borderColor: scenario === 'baseline' ? '#2a2a3a' : s.color + '40',
        }}
      >
        <div className="text-[10px] uppercase tracking-wider text-[#606070] mb-1">
          {scenario === 'baseline' ? 'Projected' : `With AI (${s.name})`}
        </div>
        <div
          className="text-2xl font-bold tabular-nums"
          style={{ color: scenario === 'baseline' ? '#9898aa' : s.color }}
        >
          {projection.projectedCpi.toFixed(2)}%
        </div>
        <div className="text-[10px] mt-1" style={{ color: scenario === 'baseline' ? '#606070' : s.color + 'aa' }}>
          {getHorizonLabel(horizon)} projection
        </div>
      </div>

      {/* AI Impact */}
      <div className="bg-[#13131d] border border-[#2a2a3a] rounded-md p-4">
        <div className="text-[10px] uppercase tracking-wider text-[#606070] mb-1">
          AI Impact
        </div>
        {scenario === 'baseline' ? (
          <div className="text-2xl font-bold tabular-nums text-[#606070]">
            N/A
          </div>
        ) : (
          <div
            className={`text-2xl font-bold tabular-nums ${
              projection.totalAiImpactPp < 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {formatPp(projection.totalAiImpactPp)}
          </div>
        )}
        <div className="text-[10px] text-[#606070] mt-1">
          {scenario === 'baseline' ? 'Select a scenario to see impact' : s.alignedWith}
        </div>
      </div>
    </div>
  );
}
