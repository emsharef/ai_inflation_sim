'use client';

import { ScenarioId, HorizonId } from '@/lib/types';
import { scenarios } from '@/data/scenarios';

interface ScenarioSelectorProps {
  scenario: ScenarioId;
  horizon: HorizonId;
  onScenarioChange: (s: ScenarioId) => void;
  onHorizonChange: (h: HorizonId) => void;
}

const scenarioOrder: ScenarioId[] = ['baseline', 'conservative', 'moderate', 'transformative'];

const horizonOptions: { id: HorizonId; label: string }[] = [
  { id: '1yr', label: '1Y' },
  { id: '3yr', label: '3Y' },
  { id: '10yr', label: '10Y' },
];

export default function ScenarioSelector({
  scenario,
  horizon,
  onScenarioChange,
  onHorizonChange,
}: ScenarioSelectorProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Scenario toggle */}
      <div className="flex items-center gap-1 bg-[#111118] rounded p-0.5 border border-[#2a2a3a]">
        {scenarioOrder.map((id) => {
          const s = scenarios[id];
          const isActive = scenario === id;
          return (
            <button
              key={id}
              onClick={() => onScenarioChange(id)}
              className={`px-3 py-1.5 text-xs rounded transition-all ${
                isActive
                  ? 'text-white font-medium'
                  : 'text-[#606070] hover:text-[#9898aa]'
              }`}
              style={isActive ? { backgroundColor: s.color + '30', color: s.color } : {}}
            >
              {s.name}
            </button>
          );
        })}
      </div>

      {/* Horizon toggle */}
      <div className="flex items-center gap-1 bg-[#111118] rounded p-0.5 border border-[#2a2a3a]">
        {horizonOptions.map((h) => {
          const isActive = horizon === h.id;
          return (
            <button
              key={h.id}
              onClick={() => onHorizonChange(h.id)}
              className={`px-2.5 py-1.5 text-xs rounded transition-all ${
                isActive
                  ? 'bg-[#1a1a24] text-[#e4e4ef] font-medium'
                  : 'text-[#606070] hover:text-[#9898aa]'
              }`}
            >
              {h.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
