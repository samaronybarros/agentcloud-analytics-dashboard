import { withErrorHandler } from '@/lib/utils/api-handler';
import { filterRunsByDateRange, parseDateParams } from '@/lib/utils/date-filter';
import { computeTeamUsage, computeCostByModel, computeTopUsers } from '@/lib/analytics/teams';
import { agents, runs, users } from '@/lib/mock-data';

export const GET = withErrorHandler((request) => {
  const { from, to } = parseDateParams(request);
  const filtered = filterRunsByDateRange(runs, from, to);
  return {
    teamUsage: computeTeamUsage(filtered, agents, users),
    costByModel: computeCostByModel(filtered, agents),
    topUsers: computeTopUsers(filtered, users),
  };
});
