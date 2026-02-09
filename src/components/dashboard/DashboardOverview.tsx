'use client';

import { useState } from 'react';
import { useScenario } from '@/hooks/useScenario';
import ScenarioSelector from './ScenarioSelector';
import InflationSummaryCard from './InflationSummaryCard';
import InflationTrajectoryChart from '@/components/charts/InflationTrajectoryChart';
import WaterfallChart from '@/components/charts/WaterfallChart';
import CpiTreeView from '@/components/cpi/CpiTreeView';
import CpiComponentCard from '@/components/cpi/CpiComponentCard';
import { cpiComponents } from '@/data/cpiComponents';
import { aggregateComponentImpact, projectComponent } from '@/lib/calculations';
import { formatPp, getImpactColor, getHorizonLabel } from '@/lib/formatters';
import { scenarios } from '@/data/scenarios';
import { ScenarioId } from '@/lib/types';

export default function DashboardOverview() {
  const { scenario, horizon, setScenario, setHorizon } = useScenario();
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#e4e4ef]">AI Inflation Impact Simulator</h1>
          <p className="text-xs text-[#606070] mt-0.5">
            How AI dissemination affects CPI inflation across consumer spending categories
          </p>
        </div>
        <ScenarioSelector
          scenario={scenario}
          horizon={horizon}
          onScenarioChange={setScenario}
          onHorizonChange={setHorizon}
        />
      </div>

      {/* Summary cards */}
      <InflationSummaryCard scenario={scenario} horizon={horizon} />

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4">
        <InflationTrajectoryChart scenario={scenario} horizon={horizon} showAllScenarios={true} />
        <WaterfallChart scenario={scenario} horizon={horizon} />
      </div>

      {/* CPI Tree + Detail panel */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <CpiTreeView
            scenario={scenario}
            horizon={horizon}
            onSelectComponent={setSelectedComponent}
            selectedId={selectedComponent}
          />
        </div>
        <div className="col-span-4 space-y-4">
          {selectedComponent ? (
            <>
              <CpiComponentCard
                componentId={selectedComponent}
                scenario={scenario}
                horizon={horizon}
              />

              {/* Cross-scenario comparison for selected component */}
              {cpiComponents[selectedComponent] && (
                <div className="bg-[#13131d] border border-[#2a2a3a] rounded-md p-4">
                  <h3 className="text-sm font-medium text-[#e4e4ef] mb-3">
                    Scenario Comparison: {cpiComponents[selectedComponent].name}
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {(['conservative', 'moderate', 'transformative'] as ScenarioId[]).map(s => {
                      const agg = aggregateComponentImpact(selectedComponent, s, horizon);
                      const proj = projectComponent(selectedComponent, s, horizon);
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
                </div>
              )}
            </>
          ) : (
            <div className="bg-[#13131d] border border-[#2a2a3a] rounded-md p-8 flex items-center justify-center">
              <p className="text-xs text-[#606070]">
                Select a CPI component from the tree to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
