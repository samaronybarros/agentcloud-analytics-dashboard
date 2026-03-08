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
  const activeUsers = new Set(runs.map((r) => r.userId)).size;
  const activeAgents = new Set(runs.map((r) => r.agentId)).size;
  const successCount = runs.filter((r) => r.status === 'success').length;
  const successRate = successCount / totalRuns;

  const totalDuration = runs.reduce((sum, r) => sum + r.durationMs, 0);
  const avgLatencyMs = totalDuration / totalRuns;

  const sortedDurations = runs.map((r) => r.durationMs).sort((a, b) => a - b);
  const p95Index = Math.ceil(sortedDurations.length * 0.95) - 1;
  const p95LatencyMs = sortedDurations[p95Index];

  const totalTokens = runs.reduce(
    (sum, r) => sum + r.tokensInput + r.tokensOutput,
    0,
  );
  const estimatedCost = runs.reduce((sum, r) => sum + r.estimatedCost, 0);

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
