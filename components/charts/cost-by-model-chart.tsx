'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { CostByModelEntry } from '@/lib/types';

const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'];

export function CostByModelChart({ data }: { data: CostByModelEntry[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="totalCost"
          nameKey="model"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
