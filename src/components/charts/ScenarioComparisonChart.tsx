'use client';

import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { HorizonId, ScenarioId } from '@/lib/types';
import { calculateAggregateProjection, projectMajorGroup } from '@/lib/calculations';
import { getMajorGroups } from '@/data/cpiComponents';
import { scenarios } from '@/data/scenarios';

interface ScenarioComparisonChartProps {
  horizon: HorizonId;
  activeScenario?: ScenarioId;
}

export default function ScenarioComparisonChart({ horizon, activeScenario }: ScenarioComparisonChartProps) {
  const data = useMemo(() => {
    const groups = getMajorGroups();
    return groups.map(g => {
      const cons = projectMajorGroup(g.id, 'conservative', horizon);
      const mod = projectMajorGroup(g.id, 'moderate', horizon);
      const trans = projectMajorGroup(g.id, 'transformative', horizon);
      return {
        name: g.name.length > 10 ? g.name.slice(0, 10) + '..' : g.name,
        fullName: g.name,
        conservative: Number(cons.aiImpactPp.toFixed(3)),
        moderate: Number(mod.aiImpactPp.toFixed(3)),
        transformative: Number(trans.aiImpactPp.toFixed(3)),
      };
    }).sort((a, b) => a.moderate - b.moderate);
  }, [horizon]);

  return (
    <div className="bg-[#13131d] border border-[#2a2a3a] rounded-md p-4">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-[#e4e4ef]">Scenario Comparison</h3>
        <p className="text-[10px] text-[#606070]">
          AI inflation impact (pp) by major group across all scenarios
        </p>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#1f1f2e" horizontal={false} />
          <XAxis
            type="number"
            stroke="#606070"
            tick={{ fontSize: 10, fill: '#606070' }}
            tickLine={false}
            tickFormatter={(v: number) => `${v > 0 ? '+' : ''}${v.toFixed(1)}pp`}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#606070"
            tick={{ fontSize: 10, fill: '#9898aa' }}
            tickLine={false}
            width={90}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#13131d',
              border: '1px solid #2a2a3a',
              borderRadius: '4px',
              fontSize: '11px',
              color: '#e4e4ef',
            }}
            formatter={((value: any, name: any) => [
              `${Number(value) > 0 ? '+' : ''}${Number(value).toFixed(3)}pp`,
              scenarios[name as ScenarioId]?.name || name,
            ]) as never}
          />
          <Legend
            wrapperStyle={{ fontSize: '10px' }}
            formatter={((value: any) => scenarios[value as ScenarioId]?.name || value) as never}
          />
          <Bar dataKey="conservative" fill="#3b82f6"
            fillOpacity={!activeScenario || activeScenario === 'conservative' ? 0.8 : 0.2}
            radius={[0, 2, 2, 0]} />
          <Bar dataKey="moderate" fill="#f59e0b"
            fillOpacity={!activeScenario || activeScenario === 'moderate' ? 0.8 : 0.2}
            radius={[0, 2, 2, 0]} />
          <Bar dataKey="transformative" fill="#10b981"
            fillOpacity={!activeScenario || activeScenario === 'transformative' ? 0.8 : 0.2}
            radius={[0, 2, 2, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
