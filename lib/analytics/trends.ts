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

function percentile(sorted: number[], rank: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.ceil(sorted.length * rank) - 1;
  return sorted[Math.max(0, idx)];
}

export function computeRunsTrend(runs: readonly Run[]): DailyRunsTrend[] {
  const groups = groupRunsByDate(runs);
  const entries: DailyRunsTrend[] = [];

  for (const [date, dayRuns] of groups) {
    entries.push({
      date,
      total: dayRuns.length,
      success: dayRuns.filter((run) => run.status === 'success').length,
      error: dayRuns.filter((run) => run.status === 'error').length,
      retry: dayRuns.filter((run) => run.status === 'retry').length,
    });
  }

  return entries.sort((left, right) => left.date.localeCompare(right.date));
}

export function computeLatencyTrend(runs: readonly Run[]): DailyLatencyTrend[] {
  const groups = groupRunsByDate(runs);
  const entries: DailyLatencyTrend[] = [];

  for (const [date, dayRuns] of groups) {
    const sorted = dayRuns.map((run) => run.durationMs).sort((left, right) => left - right);
    entries.push({
      date,
      p50: percentile(sorted, 0.5),
      p95: percentile(sorted, 0.95),
    });
  }

  return entries.sort((left, right) => left.date.localeCompare(right.date));
}

export function computeCostTrend(runs: readonly Run[]): DailyCostTrend[] {
  const groups = groupRunsByDate(runs);
  const entries: DailyCostTrend[] = [];

  for (const [date, dayRuns] of groups) {
    entries.push({
      date,
      cost: dayRuns.reduce((sum, run) => sum + run.estimatedCost, 0),
    });
  }

  return entries.sort((left, right) => left.date.localeCompare(right.date));
}
