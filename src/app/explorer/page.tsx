'use client';

import { useState } from 'react';
import { useScenario } from '@/hooks/useScenario';
import ScenarioSelector from '@/components/dashboard/ScenarioSelector';
import CpiTreeView from '@/components/cpi/CpiTreeView';
import CpiComponentCard from '@/components/cpi/CpiComponentCard';
import WeightComparisonChart from '@/components/charts/WeightComparisonChart';
import { cpiComponents } from '@/data/cpiComponents';
import { aggregateComponentImpact, projectComponent } from '@/lib/calculations';
import { formatPp, getImpactColor, getHorizonLabel } from '@/lib/formatters';
import { scenarios } from '@/data/scenarios';
import { ScenarioId } from '@/lib/types';

export default function ExplorerPage() {
  const { scenario, horizon, setScenario, setHorizon } = useScenario();
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const component = selectedComponent ? cpiComponents[selectedComponent] : null;

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#e4e4ef]">CPI Explorer</h1>
          <p className="text-xs text-[#606070] mt-0.5">
            Deep-dive into individual CPI components and their AI exposure
          </p>
        </div>
        <ScenarioSelector
          scenario={scenario}
          horizon={horizon}
          onScenarioChange={setScenario}
          onHorizonChange={setHorizon}
        />
      </div>

      {/* Main content: sidebar tree + detail panel */}
      <div className="grid grid-cols-12 gap-4">
        {/* Sidebar tree */}
        <div className="col-span-7">
          <CpiTreeView
            scenario={scenario}
            horizon={horizon}
            onSelectComponent={setSelectedComponent}
            selectedId={selectedComponent}
          />
        </div>

        {/* Detail panel */}
        <div className="col-span-5 space-y-4">
          {component ? (
            <>
              {/* Component detail card */}
              <CpiComponentCard
                componentId={selectedComponent!}
                scenario={scenario}
                horizon={horizon}
              />

              {/* Cross-scenario comparison for this component */}
              <div className="bg-[#13131d] border border-[#2a2a3a] rounded-md p-4">
                <h3 className="text-sm font-medium text-[#e4e4ef] mb-3">
                  Scenario Comparison: {component.name}
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {(['conservative', 'moderate', 'transformative'] as ScenarioId[]).map(s => {
                    const agg = aggregateComponentImpact(selectedComponent!, s, horizon);
                    const proj = projectComponent(selectedComponent!, s, horizon);
                    const sc = scenarios[s];
                    return (
                      <div key={s} className="bg-[#0a0a0f] rounded p-3">
                        <div className="flex items-center gap-1.5 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sc.color }} />
                          <span className="text-[10px] font-medium" style={{ color: sc.color }}>
                            {sc.name}
                          </span>
                        </div>
                        <div className={`text-lg font-bold tabular-nums ${getImpactColor(agg.aiImpactPp)}`}>
                          {formatPp(agg.aiImpactPp)}
                        </div>
                        <div className="text-[10px] text-[#606070] mt-1">
                          {(proj.baselineRate + agg.aiImpactPp).toFixed(2)}% projected
                        </div>
                        {agg.weightShiftPp !== 0 && (
                          <div className="text-[10px] text-[#606070] mt-0.5">
                            Weight: {formatPp(agg.weightShiftPp)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* All horizons for current scenario */}
                <div className="mt-4 pt-4 border-t border-[#2a2a3a]">
                  <h4 className="text-xs text-[#606070] mb-2">Timeline ({scenarios[scenario].name})</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {(['1yr', '3yr', '10yr'] as const).map(h => {
                      const agg = aggregateComponentImpact(selectedComponent!, scenario, h);
                      return (
                        <div key={h} className={`bg-[#0a0a0f] rounded p-2 ${h === horizon ? 'ring-1 ring-[#2a2a3a]' : ''}`}>
                          <div className="text-[10px] text-[#606070] mb-1">{getHorizonLabel(h)}</div>
                          <div className={`text-sm font-bold tabular-nums ${getImpactColor(agg.aiImpactPp)}`}>
                            {formatPp(agg.aiImpactPp)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Weight comparison */}
              <WeightComparisonChart scenario={scenario} horizon={horizon} />
            </>
          ) : (
            <div className="bg-[#13131d] border border-[#2a2a3a] rounded-md p-16 flex flex-col items-center justify-center">
              <div className="text-2xl text-[#2a2a3a] mb-3">◇</div>
              <p className="text-sm text-[#606070]">
                Select a CPI component from the tree
              </p>
              <p className="text-[10px] text-[#606070] mt-1">
                View detailed AI impact analysis, explanations, and research citations
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
