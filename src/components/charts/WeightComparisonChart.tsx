'use client';

import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { ScenarioId, HorizonId } from '@/lib/types';
import { projectMajorGroup } from '@/lib/calculations';
import { getMajorGroups } from '@/data/cpiComponents';
import { scenarios } from '@/data/scenarios';

interface WeightComparisonChartProps {
  scenario: ScenarioId;
  horizon: HorizonId;
}

export default function WeightComparisonChart({ scenario, horizon }: WeightComparisonChartProps) {
  const data = useMemo(() => {
    const groups = getMajorGroups();
    return groups.map(g => {
      const proj = projectMajorGroup(g.id, scenario, horizon);
      return {
        name: g.name.length > 10 ? g.name.slice(0, 10) + '..' : g.name,
        fullName: g.name,
        original: Number(proj.originalWeight.toFixed(1)),
        adjusted: Number(proj.adjustedWeight.toFixed(1)),
        shift: Number(proj.weightShiftPp.toFixed(2)),
      };
    }).sort((a, b) => b.original - a.original);
  }, [scenario, horizon]);

  return (
    <div className="bg-[#13131d] border border-[#2a2a3a] rounded-md p-4">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-[#e4e4ef]">CPI Weight Shift</h3>
        <p className="text-[10px] text-[#606070]">
          Original vs AI-adjusted weights (before rebalancing)
        </p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f1f2e" />
          <XAxis
            dataKey="name"
            stroke="#606070"
            tick={{ fontSize: 9, fill: '#606070' }}
            tickLine={false}
            angle={-30}
            textAnchor="end"
            height={60}
          />
          <YAxis
            stroke="#606070"
            tick={{ fontSize: 10, fill: '#606070' }}
            tickLine={false}
            tickFormatter={(v: number) => `${v}%`}
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
              `${Number(value).toFixed(1)}%`,
              name === 'original' ? 'Original Weight' : 'Adjusted Weight'
            ]) as never}
          />
          <Legend
            wrapperStyle={{ fontSize: '10px', color: '#9898aa' }}
            formatter={((value: any) => value === 'original' ? 'Original' : 'AI-Adjusted') as never}
          />
          <Bar dataKey="original" fill="#606070" fillOpacity={0.5} radius={[2, 2, 0, 0]} />
          <Bar dataKey="adjusted" fill={scenarios[scenario].color} fillOpacity={0.7} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
