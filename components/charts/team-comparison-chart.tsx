'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { TeamUsageEntry } from '@/lib/types';

interface ChartDatum {
  team: string;
  successRate: number;
  avgLatencyMs: number;
  totalRuns: number;
  totalCost: number;
}

function toChartData(data: TeamUsageEntry[]): ChartDatum[] {
  return data.map((entry) => ({
    team: entry.team,
    successRate: Math.round(entry.successRate * 1000) / 10,
    avgLatencyMs: Math.round(entry.avgLatencyMs),
    totalRuns: entry.totalRuns,
    totalCost: Math.round(entry.totalCost * 100) / 100,
  }));
}

export function TeamComparisonChart({ data }: { data: TeamUsageEntry[] }) {
  const chartData = toChartData(data);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 8, right: 16, bottom: 8, left: 16 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="team" />
        <YAxis yAxisId="left" label={{ value: 'Success %', angle: -90, position: 'insideLeft' }} />
        <YAxis yAxisId="right" orientation="right" label={{ value: 'Runs', angle: 90, position: 'insideRight' }} />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="successRate" name="Success Rate (%)" fill="#10b981" />
        <Bar yAxisId="right" dataKey="totalRuns" name="Total Runs" fill="#3b82f6" />
        <Bar yAxisId="right" dataKey="totalCost" name="Total Cost ($)" fill="#f59e0b" />
      </BarChart>
    </ResponsiveContainer>
  );
}
