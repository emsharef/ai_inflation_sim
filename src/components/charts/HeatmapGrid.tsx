'use client';

import { useMemo, useState } from 'react';
import { ScenarioId, HorizonId } from '@/lib/types';
import { cpiComponents } from '@/data/cpiComponents';
import { aggregateComponentImpact } from '@/lib/calculations';
import { getHeatmapBg, getHeatmapText, formatSigned } from '@/lib/formatters';

type ViewMode = 'inflation' | 'weight' | 'both';

interface HeatmapGridProps {
  scenario?: ScenarioId;
  showAllScenarios?: boolean;
}

const horizons: HorizonId[] = ['1yr', '3yr', '10yr'];
const scenarioIds: ScenarioId[] = ['conservative', 'moderate', 'transformative'];

function WeightBg(val: number): string {
  if (val <= -0.2) return 'bg-orange-600/60';
  if (val <= -0.05) return 'bg-orange-500/40';
  if (val <= -0.01) return 'bg-orange-400/25';
  if (val < 0.01) return 'bg-zinc-700/40';
  if (val < 0.05) return 'bg-sky-400/25';
  if (val < 0.2) return 'bg-sky-500/40';
  return 'bg-sky-600/60';
}

function WeightText(val: number): string {
  if (val <= -0.05) return 'text-orange-200';
  if (val <= -0.01) return 'text-orange-300';
  if (val < 0.01) return 'text-zinc-300';
  if (val < 0.05) return 'text-sky-300';
  return 'text-sky-200';
}

function ModeToggle({ mode, onChange }: { mode: ViewMode; onChange: (m: ViewMode) => void }) {
  return (
    <div className="inline-flex items-center gap-0.5 bg-[#0a0a0f] rounded p-0.5 text-[10px]">
      {([
        ['inflation', 'Inflation'],
        ['weight', 'Weight Shift'],
        ['both', 'Both'],
      ] as [ViewMode, string][]).map(([value, label]) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`px-2 py-1 rounded transition-colors ${
            mode === value
              ? 'bg-[#1a1a24] text-[#e4e4ef] border border-[#2a2a3a]'
              : 'text-[#606070] hover:text-[#9898aa]'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function CellContent({ impact, mode }: { impact: { aiImpactPp: number; weightShiftPp: number }; mode: ViewMode }) {
  const inflation = impact.aiImpactPp;
  const weight = impact.weightShiftPp;

  if (mode === 'inflation') {
    return (
      <td className={`py-1.5 px-2 text-center tabular-nums ${getHeatmapBg(inflation)} ${getHeatmapText(inflation)}`}>
        {inflation !== 0 ? formatSigned(inflation) : '-'}
      </td>
    );
  }

  if (mode === 'weight') {
    return (
      <td className={`py-1.5 px-2 text-center tabular-nums ${WeightBg(weight)} ${WeightText(weight)}`}>
        {weight !== 0 ? formatSigned(weight) : '-'}
      </td>
    );
  }

  // Both mode: inflation on top, weight below
  return (
    <td className={`py-0.5 px-1 text-center tabular-nums ${getHeatmapBg(inflation)}`}>
      <div className={getHeatmapText(inflation)} style={{ fontSize: '10px' }}>
        {inflation !== 0 ? formatSigned(inflation) : '-'}
      </div>
      {weight !== 0 && (
        <div className={WeightText(weight)} style={{ fontSize: '8px', opacity: 0.8 }}>
          w{weight > 0 ? '+' : ''}{weight.toFixed(2)}
        </div>
      )}
    </td>
  );
}

export default function HeatmapGrid({ scenario = 'moderate', showAllScenarios = false }: HeatmapGridProps) {
  const [mode, setMode] = useState<ViewMode>('both');

  const components = useMemo(() => {
    const leaves = Object.values(cpiComponents).filter(c => c.children.length === 0);
    return leaves.sort((a, b) => b.weight - a.weight).slice(0, 30);
  }, []);

  const subtitle = mode === 'inflation'
    ? 'Inflation impact (pp) across time horizons'
    : mode === 'weight'
    ? 'CPI weight shift (pp) across time horizons'
    : 'Inflation impact & weight shift (pp) across time horizons';

  if (showAllScenarios) {
    return (
      <div className="bg-[#13131d] border border-[#2a2a3a] rounded-md p-4 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-[#e4e4ef]">AI Impact Heatmap</h3>
            <p className="text-[10px] text-[#606070]">{subtitle}</p>
          </div>
          <ModeToggle mode={mode} onChange={setMode} />
        </div>
        <table className="w-full text-[10px]">
          <thead>
            <tr className="border-b border-[#2a2a3a]">
              <th className="text-left py-1.5 px-2 text-[#606070] font-normal w-40">Category</th>
              <th className="text-right py-1.5 px-1 text-[#606070] font-normal w-12">Wt%</th>
              {scenarioIds.map(s => (
                horizons.map(h => (
                  <th key={`${s}_${h}`} className="text-center py-1.5 px-1 text-[#606070] font-normal w-14">
                    <div className="text-[9px]">{s.slice(0, 4).toUpperCase()}</div>
                    <div>{h}</div>
                  </th>
                ))
              ))}
            </tr>
          </thead>
          <tbody>
            {components.map((comp) => (
              <tr key={comp.id} className="border-b border-[#1a1a24] hover:bg-[#111118]">
                <td className="py-1 px-2 text-[#9898aa] truncate max-w-[160px]" title={comp.name}>
                  {comp.name}
                </td>
                <td className="py-1 px-1 text-right text-[#606070] tabular-nums">
                  {comp.weight.toFixed(1)}
                </td>
                {scenarioIds.map(s => (
                  horizons.map(h => {
                    const agg = aggregateComponentImpact(comp.id, s, h);
                    return <CellContent key={`${comp.id}_${s}_${h}`} impact={agg} mode={mode} />;
                  })
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {mode !== 'inflation' && (
          <div className="mt-3 flex items-center gap-4 text-[9px] text-[#606070]">
            <span className="flex items-center gap-1">
              <span className="w-3 h-2 rounded-sm bg-sky-500/40 inline-block" /> Weight increases (spending shifts toward)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-2 rounded-sm bg-orange-500/40 inline-block" /> Weight decreases (spending shifts away)
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[#13131d] border border-[#2a2a3a] rounded-md p-4 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-[#e4e4ef]">AI Impact Heatmap</h3>
          <p className="text-[10px] text-[#606070]">{subtitle}</p>
        </div>
        <ModeToggle mode={mode} onChange={setMode} />
      </div>
      <table className="w-full text-[10px]">
        <thead>
          <tr className="border-b border-[#2a2a3a]">
            <th className="text-left py-1.5 px-2 text-[#606070] font-normal">Category</th>
            <th className="text-right py-1.5 px-2 text-[#606070] font-normal w-14">Weight</th>
            {horizons.map(h => (
              <th key={h} className="text-center py-1.5 px-2 text-[#606070] font-normal w-20">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {components.map((comp) => (
            <tr key={comp.id} className="border-b border-[#1a1a24] hover:bg-[#111118]">
              <td className="py-1.5 px-2 text-[#9898aa]">{comp.name}</td>
              <td className="py-1.5 px-2 text-right text-[#606070] tabular-nums">
                {comp.weight.toFixed(1)}%
              </td>
              {horizons.map(h => {
                const agg = aggregateComponentImpact(comp.id, scenario, h);
                return <CellContent key={h} impact={agg} mode={mode} />;
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {mode !== 'inflation' && (
        <div className="mt-3 flex items-center gap-4 text-[9px] text-[#606070]">
          <span className="flex items-center gap-1">
            <span className="w-3 h-2 rounded-sm bg-sky-500/40 inline-block" /> Weight increases (spending shifts toward)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-2 rounded-sm bg-orange-500/40 inline-block" /> Weight decreases (spending shifts away)
          </span>
        </div>
      )}
    </div>
  );
}
