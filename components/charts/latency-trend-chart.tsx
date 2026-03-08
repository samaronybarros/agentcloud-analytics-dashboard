'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { DailyLatencyTrend } from '@/lib/analytics/trends';

export function LatencyTrendChart({ data }: { data: DailyLatencyTrend[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(d) => d.slice(5)} />
        <YAxis tick={{ fontSize: 12 }} unit="ms" />
        <Tooltip formatter={(v: number) => `${v.toLocaleString('en-US')}ms`} />
        <Line type="monotone" dataKey="p50" stroke="#3b82f6" name="p50" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="p95" stroke="#8b5cf6" name="p95" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
