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
import type { ErrorTimelineEntry } from '@/lib/types';

function formatDate(dateString: string): string {
  const [, month, day] = dateString.split('-');
  return `${month}-${day}`;
}

export function ErrorTimelineChart({ data }: { data: ErrorTimelineEntry[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="errors"
          stackId="1"
          fill="#ef4444"
          stroke="#ef4444"
          name="Errors"
        />
        <Area
          type="monotone"
          dataKey="retries"
          stackId="1"
          fill="#f59e0b"
          stroke="#f59e0b"
          name="Retries"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
