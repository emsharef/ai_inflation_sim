'use client';

import { ScenarioId, HorizonId } from '@/lib/types';
import ScenarioCard from './ScenarioCard';

interface ScenarioComparisonProps {
  horizon: HorizonId;
  activeScenario?: ScenarioId;
  onScenarioSelect?: (s: ScenarioId) => void;
}

const scenarioIds: ScenarioId[] = ['conservative', 'moderate', 'transformative'];

export default function ScenarioComparison({ horizon, activeScenario, onScenarioSelect }: ScenarioComparisonProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {scenarioIds.map(id => (
        <ScenarioCard
          key={id}
          scenarioId={id}
          horizon={horizon}
          isActive={activeScenario === id}
          onClick={() => onScenarioSelect?.(id)}
        />
      ))}
    </div>
  );
}
