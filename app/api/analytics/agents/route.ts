import { withErrorHandler } from '@/lib/utils/api-handler';
import { filterRunsByDateRange, parseDateParams } from '@/lib/utils/date-filter';
import { computeAgentLeaderboard, computeFailureTaxonomy } from '@/lib/analytics/agents';
import { agents, runs } from '@/lib/mock-data';
import type { AgentsResponse } from '@/lib/types';

export const GET = withErrorHandler((request): AgentsResponse => {
  const { from, to } = parseDateParams(request);
  const filtered = filterRunsByDateRange(runs, from, to);
  return {
    leaderboard: computeAgentLeaderboard(filtered, agents),
    failureTaxonomy: computeFailureTaxonomy(filtered),
  };
});
