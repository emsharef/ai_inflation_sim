'use client';

import { useMemo, useState } from 'react';
import { ScenarioId, HorizonId } from '@/lib/types';
import { projectMajorGroup } from '@/lib/calculations';
import { getMajorGroups } from '@/data/cpiComponents';

interface WaterfallChartProps {
  scenario: ScenarioId;
  horizon: HorizonId;
}

export default function WaterfallChart({ scenario, horizon }: WaterfallChartProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const { rows, maxAbs } = useMemo(() => {
    const groups = getMajorGroups();
    const rows = groups.map(g => {
      const proj = projectMajorGroup(g.id, scenario, horizon);
      const rateEffect = proj.aiImpactPp * (proj.originalWeight / 100);
      const totalContrib =
        (proj.projectedRate * proj.adjustedWeight -
          proj.baselineRate * proj.originalWeight) / 100;
      const weightEffect = totalContrib - rateEffect;

      return {
        id: g.id,
        name: g.name,
        rateEffect: Number(rateEffect.toFixed(4)),
        weightEffect: Number(weightEffect.toFixed(4)),
        total: Number(totalContrib.toFixed(4)),
        weight: proj.originalWeight,
        weightShiftPp: proj.weightShiftPp,
      };
    });

    rows.sort((a, b) => a.total - b.total);

    // Find max absolute value for scaling — consider both segments independently
    // since they might go in opposite directions
    let maxAbs = 0;
    for (const r of rows) {
      const left = Math.min(0, r.rateEffect, r.rateEffect + r.weightEffect);
      const right = Math.max(0, r.rateEffect, r.rateEffect + r.weightEffect);
      maxAbs = Math.max(maxAbs, Math.abs(left), Math.abs(right));
    }
    maxAbs = maxAbs || 0.01; // prevent division by zero

    return { rows, maxAbs };
  }, [scenario, horizon]);

  const fmt = (v: number) => `${v > 0 ? '+' : ''}${v.toFixed(4)}pp`;
  // Scale value to percentage of the bar area (half-width for each side of zero)
  const pct = (v: number) => (Math.abs(v) / maxAbs) * 50;

  return (
    <div className="bg-[#13131d] border border-[#2a2a3a] rounded-md p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-medium text-[#e4e4ef]">Impact by Category</h3>
          <p className="text-[10px] text-[#606070]">
            Weighted contribution to aggregate CPI change (pp)
          </p>
        </div>
        <div className="flex items-center gap-4 text-[10px]">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2.5 rounded-sm inline-block bg-emerald-500/70" />
            <span className="text-[#9898aa]">Rate change</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2.5 rounded-sm inline-block bg-amber-500/70" />
            <span className="text-[#9898aa]">Weight shift</span>
          </span>
        </div>
      </div>

      <div className="space-y-1">
        {rows.map(r => {
          // Rate bar: goes from center (0) toward the left (negative) or right (positive)
          const rateWidth = pct(r.rateEffect);
          const rateIsNeg = r.rateEffect < 0;

          // Weight bar: stacked after rate, so starts where rate ends
          const weightWidth = pct(r.weightEffect);
          const weightIsNeg = r.weightEffect < 0;

          // Both negative: rate goes left from center, weight extends further left
          // Rate neg, weight pos: rate goes left, weight goes back toward center
          // Calculate positions relative to center (50%)
          const rateLeft = rateIsNeg ? 50 - rateWidth : 50;
          const weightLeft = weightIsNeg
            ? rateLeft - (rateIsNeg ? weightWidth : 0) + (rateIsNeg ? 0 : rateWidth) - weightWidth
            : rateLeft + (rateIsNeg ? 0 : rateWidth);

          // Simpler approach: compute segment positions on a [-max, +max] axis
          // 0 maps to 50%, -max to 0%, +max to 100%
          const toX = (v: number) => 50 + (v / maxAbs) * 50;
          const x0 = toX(0);
          const x1 = toX(r.rateEffect);
          const x2 = toX(r.rateEffect + r.weightEffect);

          const rateBarLeft = Math.min(x0, x1);
          const rateBarWidth = Math.abs(x1 - x0);
          const weightBarLeft = Math.min(x1, x2);
          const weightBarWidth = Math.abs(x2 - x1);

          const isHovered = hovered === r.id;

          return (
            <div
              key={r.id}
              className="flex items-center gap-2 group relative"
              onMouseEnter={() => setHovered(r.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Label */}
              <div className="w-[130px] flex-shrink-0 text-right text-[10px] text-[#9898aa] pr-1 truncate" title={r.name}>
                {r.name}
              </div>

              {/* Bar area */}
              <div className="flex-1 h-6 relative bg-[#0a0a0f] rounded-sm overflow-hidden">
                {/* Zero line */}
                <div className="absolute top-0 bottom-0 border-l border-[#2a2a3a]" style={{ left: '50%' }} />

                {/* Rate effect bar */}
                {rateBarWidth > 0.01 && (
                  <div
                    className="absolute top-1 bottom-1 rounded-sm transition-opacity"
                    style={{
                      left: `${rateBarLeft}%`,
                      width: `${rateBarWidth}%`,
                      backgroundColor: '#10b981',
                      opacity: isHovered ? 0.9 : 0.6,
                    }}
                  />
                )}

                {/* Weight effect bar */}
                {weightBarWidth > 0.01 && (
                  <div
                    className="absolute top-1 bottom-1 rounded-sm transition-opacity"
                    style={{
                      left: `${weightBarLeft}%`,
                      width: `${weightBarWidth}%`,
                      backgroundColor: '#f59e0b',
                      opacity: isHovered ? 0.9 : 0.6,
                    }}
                  />
                )}
              </div>

              {/* Value label */}
              <div className="w-[60px] flex-shrink-0 text-[10px] tabular-nums text-emerald-400 text-right">
                {r.total > 0 ? '+' : ''}{r.total.toFixed(3)}pp
              </div>

              {/* Tooltip */}
              {isHovered && (
                <div className="absolute left-[140px] top-full z-50 mt-1 bg-[#13131d] border border-[#2a2a3a] rounded p-2 text-[11px] text-[#e4e4ef] shadow-lg whitespace-nowrap"
                  style={{ lineHeight: '1.6' }}
                >
                  <div className="font-semibold mb-1">{r.name}</div>
                  <div><span className="text-emerald-400">Rate effect:</span> {fmt(r.rateEffect)}</div>
                  <div><span className="text-amber-400">Weight shift:</span> {fmt(r.weightEffect)}</div>
                  <div className="border-t border-[#2a2a3a] mt-1 pt-1 font-semibold">Total: {fmt(r.total)}</div>
                  <div className="text-[#606070] text-[10px] mt-0.5">
                    CPI weight: {r.weight.toFixed(1)}% · Wt shift: {r.weightShiftPp > 0 ? '+' : ''}{r.weightShiftPp.toFixed(2)}pp
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div className="flex items-center mt-2 ml-[138px] mr-[68px] text-[9px] text-[#606070]">
        <span className="flex-shrink-0">{(-maxAbs).toFixed(2)}pp</span>
        <span className="flex-1" />
        <span className="flex-shrink-0">0</span>
        <span className="flex-1" />
        <span className="flex-shrink-0">+{maxAbs.toFixed(2)}pp</span>
      </div>
    </div>
  );
}
