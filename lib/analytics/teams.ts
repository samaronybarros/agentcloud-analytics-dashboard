import type {
  Agent,
  CostByModelEntry,
  Run,
  TeamUsageEntry,
  TopUserEntry,
  User,
} from '@/lib/types';

export function computeTeamUsage(
  _runs: readonly Run[],
  _agents: readonly Agent[],
  _users: readonly User[],
): TeamUsageEntry[] {
  throw new Error('Not implemented');
}

export function computeCostByModel(
  _runs: readonly Run[],
  _agents: readonly Agent[],
): CostByModelEntry[] {
  throw new Error('Not implemented');
}

export function computeTopUsers(
  _runs: readonly Run[],
  _users: readonly User[],
): TopUserEntry[] {
  throw new Error('Not implemented');
}
