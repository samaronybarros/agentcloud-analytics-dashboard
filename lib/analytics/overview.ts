import type { Agent, OverviewKPIs, Run, User } from '@/lib/types';

export function computeOverviewKPIs(
  _runs: readonly Run[],
  _agents: readonly Agent[],
  _users: readonly User[],
): OverviewKPIs {
  throw new Error('Not implemented');
}
