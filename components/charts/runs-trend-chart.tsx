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
import type { DailyRunsTrend } from '@/lib/analytics/trends';

export function RunsTrendChart({ data }: { data: DailyRunsTrend[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(d) => d.slice(5)} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Area type="monotone" dataKey="success" stackId="1" stroke="#22c55e" fill="#bbf7d0" name="Success" />
        <Area type="monotone" dataKey="retry" stackId="1" stroke="#f59e0b" fill="#fde68a" name="Retry" />
        <Area type="monotone" dataKey="error" stackId="1" stroke="#ef4444" fill="#fecaca" name="Error" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
