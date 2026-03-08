import type { Agent, Insight, Run } from '@/lib/types';

export function generateInsights(
  _runs: readonly Run[],
  _agents: readonly Agent[],
): Insight[] {
  throw new Error('Not implemented');
}
