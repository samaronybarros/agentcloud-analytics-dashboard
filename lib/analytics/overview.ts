import type { Agent, OverviewKPIs, Run, User } from '@/lib/types';

export function computeOverviewKPIs(
  runs: readonly Run[],
  _agents: readonly Agent[],
  _users: readonly User[],
): OverviewKPIs {
  if (runs.length === 0) {
    return {
      totalRuns: 0,
      activeUsers: 0,
      activeAgents: 0,
      successRate: 0,
      avgLatencyMs: 0,
      p95LatencyMs: 0,
      totalTokens: 0,
      estimatedCost: 0,
    };
  }

  const totalRuns = runs.length;
  const activeUsers = new Set(runs.map((run) => run.userId)).size;
  const activeAgents = new Set(runs.map((run) => run.agentId)).size;
  const successCount = runs.filter((run) => run.status === 'success').length;
  const successRate = successCount / totalRuns;

  const totalDuration = runs.reduce((sum, run) => sum + run.durationMs, 0);
  const avgLatencyMs = totalDuration / totalRuns;

  const sortedDurations = runs
    .map((run) => run.durationMs)
    .sort((left, right) => left - right);
  const p95Index = Math.ceil(sortedDurations.length * 0.95) - 1;
  const p95LatencyMs = sortedDurations[p95Index];

  const totalTokens = runs.reduce(
    (sum, run) => sum + run.tokensInput + run.tokensOutput,
    0,
  );
  const estimatedCost = runs.reduce((sum, run) => sum + run.estimatedCost, 0);

  return {
    totalRuns,
    activeUsers,
    activeAgents,
    successRate,
    avgLatencyMs,
    p95LatencyMs,
    totalTokens,
    estimatedCost,
  };
}
