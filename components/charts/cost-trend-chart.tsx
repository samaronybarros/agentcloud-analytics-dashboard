'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { DailyCostTrend } from '@/lib/types';

export function CostTrendChart({ data }: { data: DailyCostTrend[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(d: string) => d.slice(5)} />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={(value: number) => `$${value}`} />
        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
        <Area type="monotone" dataKey="cost" stroke="#0ea5e9" fill="#bae6fd" name="Cost" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
