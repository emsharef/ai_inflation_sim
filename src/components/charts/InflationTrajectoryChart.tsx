'use client';

import { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { ScenarioId, HorizonId } from '@/lib/types';
import { generateTrajectory, getHistoricalCpi } from '@/lib/calculations';
import { scenarios } from '@/data/scenarios';

interface InflationTrajectoryChartProps {
  scenario: ScenarioId;
  horizon: HorizonId;
  showAllScenarios?: boolean;
}

export default function InflationTrajectoryChart({
  scenario,
  horizon,
  showAllScenarios = false,
}: InflationTrajectoryChartProps) {
  const data = useMemo(() => {
    const historical = getHistoricalCpi().map(h => ({
      label: h.label,
      historical: h.rate,
      baseline: undefined as number | undefined,
      projected: undefined as number | undefined,
      conservative_s: undefined as number | undefined,
      moderate_s: undefined as number | undefined,
      transformative_s: undefined as number | undefined,
    }));

    if (showAllScenarios) {
      const conservativeData = generateTrajectory('conservative', horizon);
      const moderateData = generateTrajectory('moderate', horizon);
      const transformativeData = generateTrajectory('transformative', horizon);

      const maxLen = Math.max(conservativeData.length, moderateData.length, transformativeData.length);
      const projected = [];
      for (let i = 0; i < maxLen; i++) {
        const c = conservativeData[i];
        const m = moderateData[i];
        const t = transformativeData[i];
        projected.push({
          label: (c || m || t).label,
          historical: i === 0 ? 2.7 : undefined,
          baseline: (c || m || t).baseline,
          projected: undefined,
          conservative_s: c?.projected,
          moderate_s: m?.projected,
          transformative_s: t?.projected,
        });
      }
      return [...historical, ...projected];
    } else {
      // For 'baseline' scenario (no AI), projected = baseline
      const effectiveScenario = scenario === 'baseline' ? 'conservative' : scenario;
      const trajectory = generateTrajectory(effectiveScenario, horizon);
      const projected = trajectory.map((p, i) => ({
        label: p.label,
        historical: i === 0 ? 2.7 : undefined,
        baseline: p.baseline,
        projected: scenario === 'baseline' ? p.baseline : p.projected,
        conservative_s: undefined,
        moderate_s: undefined,
        transformative_s: undefined,
      }));
      return [...historical, ...projected];
    }
  }, [scenario, horizon, showAllScenarios]);

  const activeIsAiScenario = scenario !== 'baseline';

  return (
    <div className="bg-[#13131d] border border-[#2a2a3a] rounded-md p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-[#e4e4ef]">Inflation Trajectory</h3>
          <p className="text-[10px] text-[#606070]">
            Historical + projected CPI-U annual rate
          </p>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-[#9898aa] inline-block" /> Historical
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-[#606070] inline-block border-t border-dashed border-[#606070]" /> Baseline (no AI)
          </span>
          {showAllScenarios ? (
            <>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-blue-500 inline-block" /> Conservative
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-amber-500 inline-block" /> Moderate
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-emerald-500 inline-block" /> Transformative
              </span>
            </>
          ) : activeIsAiScenario ? (
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 inline-block" style={{ backgroundColor: scenarios[scenario].color }} />
              {scenarios[scenario].name}
            </span>
          ) : null}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f1f2e" />
          <XAxis
            dataKey="label"
            stroke="#606070"
            tick={{ fontSize: 10, fill: '#606070' }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="#606070"
            tick={{ fontSize: 10, fill: '#606070' }}
            tickLine={false}
            domain={['auto', 'auto']}
            tickFormatter={(v: number) => `${v}%`}
          />
          <ReferenceLine y={2.0} stroke="#3b82f6" strokeDasharray="8 4" strokeOpacity={0.3} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#13131d',
              border: '1px solid #2a2a3a',
              borderRadius: '4px',
              fontSize: '11px',
              color: '#e4e4ef',
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={((value: any, name: any) => {
              const labels: Record<string, string> = {
                historical: 'Historical',
                baseline: 'Baseline (no AI)',
                projected: scenario === 'baseline' ? 'Baseline (no AI)' : `With AI (${scenarios[scenario].name})`,
                conservative_s: 'Conservative',
                moderate_s: 'Moderate',
                transformative_s: 'Transformative',
              };
              return [`${Number(value ?? 0).toFixed(2)}%`, labels[name] || name];
            }) as never}
          />
          {/* Historical line */}
          <Line
            type="monotone"
            dataKey="historical"
            stroke="#9898aa"
            strokeWidth={2}
            dot={{ r: 3, fill: '#9898aa' }}
            connectNulls={false}
          />
          {showAllScenarios ? (
            <>
              <Line type="monotone" dataKey="baseline" stroke="#606070" strokeWidth={scenario === 'baseline' ? 3 : 1} strokeDasharray="4 4" dot={false} connectNulls={false} />
              <Line type="monotone" dataKey="conservative_s" stroke="#3b82f6"
                strokeWidth={scenario === 'conservative' ? 3 : 1.5}
                strokeOpacity={scenario === 'conservative' ? 1 : 0.35}
                dot={false} connectNulls={false} />
              <Line type="monotone" dataKey="moderate_s" stroke="#f59e0b"
                strokeWidth={scenario === 'moderate' ? 3 : 1.5}
                strokeOpacity={scenario === 'moderate' ? 1 : 0.35}
                dot={false} connectNulls={false} />
              <Line type="monotone" dataKey="transformative_s" stroke="#10b981"
                strokeWidth={scenario === 'transformative' ? 3 : 1.5}
                strokeOpacity={scenario === 'transformative' ? 1 : 0.35}
                dot={false} connectNulls={false} />
            </>
          ) : (
            <>
              <Line type="monotone" dataKey="baseline" stroke="#606070" strokeWidth={1} strokeDasharray="4 4" dot={false} connectNulls={false} />
              {activeIsAiScenario && (
                <Line type="monotone" dataKey="projected" stroke={scenarios[scenario].color} strokeWidth={2} dot={false} connectNulls={false} />
              )}
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
