'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { FailureTaxonomyEntry } from '@/lib/types';

export function FailureTaxonomyChart({ data }: { data: FailureTaxonomyEntry[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="errorType" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} name="Count" />
      </BarChart>
    </ResponsiveContainer>
  );
}
