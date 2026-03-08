import type { Run } from '@/lib/types';

export interface DailyRunsTrend {
  date: string; // YYYY-MM-DD
  total: number;
  success: number;
  error: number;
  retry: number;
}

export interface DailyLatencyTrend {
  date: string;
  p50: number;
  p95: number;
}

export interface DailyCostTrend {
  date: string;
  cost: number;
}

function groupRunsByDate(runs: readonly Run[]): Map<string, Run[]> {
  const groups = new Map<string, Run[]>();
  for (const run of runs) {
    const date = run.startedAt.slice(0, 10);
    const existing = groups.get(date);
    if (existing) {
      existing.push(run);
    } else {
      groups.set(date, [run]);
    }
  }
  return groups;
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.ceil(sorted.length * p) - 1;
  return sorted[Math.max(0, idx)];
}

export function computeRunsTrend(runs: readonly Run[]): DailyRunsTrend[] {
  const groups = groupRunsByDate(runs);
  const entries: DailyRunsTrend[] = [];

  for (const [date, dayRuns] of groups) {
    entries.push({
      date,
      total: dayRuns.length,
      success: dayRuns.filter((r) => r.status === 'success').length,
      error: dayRuns.filter((r) => r.status === 'error').length,
      retry: dayRuns.filter((r) => r.status === 'retry').length,
    });
  }

  return entries.sort((a, b) => a.date.localeCompare(b.date));
}

export function computeLatencyTrend(runs: readonly Run[]): DailyLatencyTrend[] {
  const groups = groupRunsByDate(runs);
  const entries: DailyLatencyTrend[] = [];

  for (const [date, dayRuns] of groups) {
    const sorted = dayRuns.map((r) => r.durationMs).sort((a, b) => a - b);
    entries.push({
      date,
      p50: percentile(sorted, 0.5),
      p95: percentile(sorted, 0.95),
    });
  }

  return entries.sort((a, b) => a.date.localeCompare(b.date));
}

export function computeCostTrend(runs: readonly Run[]): DailyCostTrend[] {
  const groups = groupRunsByDate(runs);
  const entries: DailyCostTrend[] = [];

  for (const [date, dayRuns] of groups) {
    entries.push({
      date,
      cost: dayRuns.reduce((sum, r) => sum + r.estimatedCost, 0),
    });
  }

  return entries.sort((a, b) => a.date.localeCompare(b.date));
}
