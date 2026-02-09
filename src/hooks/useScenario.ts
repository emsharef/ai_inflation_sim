'use client';

import { useState, useCallback } from 'react';
import { ScenarioId, HorizonId } from '@/lib/types';

export function useScenario() {
  const [scenario, setScenario] = useState<ScenarioId>('moderate');
  const [horizon, setHorizon] = useState<HorizonId>('10yr');

  const toggleScenario = useCallback((s: ScenarioId) => {
    setScenario(s);
  }, []);

  const toggleHorizon = useCallback((h: HorizonId) => {
    setHorizon(h);
  }, []);

  return {
    scenario,
    horizon,
    setScenario: toggleScenario,
    setHorizon: toggleHorizon,
  };
}
