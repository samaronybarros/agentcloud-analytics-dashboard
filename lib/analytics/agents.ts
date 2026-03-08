import type { Agent, AgentLeaderboardEntry, FailureTaxonomyEntry, Run } from '@/lib/types';

export function computeAgentLeaderboard(
  runs: readonly Run[],
  agents: readonly Agent[],
): AgentLeaderboardEntry[] {
  if (runs.length === 0) return [];

  const agentMap = new Map(agents.map((a) => [a.id, a]));

  // Group runs by agent
  const grouped = new Map<string, Run[]>();
  for (const run of runs) {
    const existing = grouped.get(run.agentId);
    if (existing) {
      existing.push(run);
    } else {
      grouped.set(run.agentId, [run]);
    }
  }

  const entries: AgentLeaderboardEntry[] = [];
  for (const [agentId, agentRuns] of grouped) {
    const agent = agentMap.get(agentId);
    if (!agent) continue;

    const totalRuns = agentRuns.length;
    const successCount = agentRuns.filter((r) => r.status === 'success').length;
    const totalDuration = agentRuns.reduce((sum, r) => sum + r.durationMs, 0);
    const totalCost = agentRuns.reduce((sum, r) => sum + r.estimatedCost, 0);

    entries.push({
      agentId,
      agentName: agent.name,
      team: agent.team,
      totalRuns,
      successRate: successCount / totalRuns,
      avgLatencyMs: totalDuration / totalRuns,
      totalCost,
    });
  }

  return entries.sort((a, b) => b.totalRuns - a.totalRuns);
}

export function computeFailureTaxonomy(
  runs: readonly Run[],
): FailureTaxonomyEntry[] {
  const errorRuns = runs.filter((r) => r.errorType !== null);
  if (errorRuns.length === 0) return [];

  const counts = new Map<string, number>();
  for (const run of errorRuns) {
    const key = run.errorType!;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const totalErrors = errorRuns.length;
  const entries: FailureTaxonomyEntry[] = [];
  for (const [errorType, count] of counts) {
    entries.push({
      errorType,
      count,
      percentage: count / totalErrors,
    });
  }

  return entries.sort((a, b) => b.count - a.count);
}
