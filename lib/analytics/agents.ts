import type { Agent, AgentLeaderboardEntry, FailureTaxonomyEntry, Run } from '@/lib/types';

export function computeAgentLeaderboard(
  _runs: readonly Run[],
  _agents: readonly Agent[],
): AgentLeaderboardEntry[] {
  throw new Error('Not implemented');
}

export function computeFailureTaxonomy(
  _runs: readonly Run[],
): FailureTaxonomyEntry[] {
  throw new Error('Not implemented');
}
