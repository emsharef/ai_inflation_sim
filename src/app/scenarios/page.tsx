'use client';

import { useScenario } from '@/hooks/useScenario';
import ScenarioSelector from '@/components/dashboard/ScenarioSelector';
import ScenarioComparison from '@/components/scenarios/ScenarioComparison';
import InflationTrajectoryChart from '@/components/charts/InflationTrajectoryChart';
import ScenarioComparisonChart from '@/components/charts/ScenarioComparisonChart';
import RateShiftChart from '@/components/charts/RateShiftChart';
import WeightComparisonChart from '@/components/charts/WeightComparisonChart';
import HeatmapGrid from '@/components/charts/HeatmapGrid';

export default function ScenariosPage() {
  const { scenario, horizon, setScenario, setHorizon } = useScenario();

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#e4e4ef]">Scenario Comparison</h1>
          <p className="text-xs text-[#606070] mt-0.5">
            Side-by-side analysis of three AI adoption scenarios
          </p>
        </div>
        <ScenarioSelector
          scenario={scenario}
          horizon={horizon}
          onScenarioChange={setScenario}
          onHorizonChange={setHorizon}
        />
      </div>

      {/* 3-column scenario cards */}
      <ScenarioComparison
        horizon={horizon}
        activeScenario={scenario}
        onScenarioSelect={setScenario}
      />

      {/* Trajectory + aggregate comparison */}
      <div className="grid grid-cols-2 gap-4">
        <InflationTrajectoryChart
          scenario={scenario}
          horizon={horizon}
          showAllScenarios
        />
        <ScenarioComparisonChart horizon={horizon} activeScenario={scenario} />
      </div>

      {/* Rate shift + Weight shift decomposition */}
      <div className="grid grid-cols-2 gap-4">
        <RateShiftChart scenario={scenario} horizon={horizon} />
        <WeightComparisonChart scenario={scenario} horizon={horizon} />
      </div>

      {/* Full heatmap grid */}
      <HeatmapGrid showAllScenarios />
    </div>
  );
}
