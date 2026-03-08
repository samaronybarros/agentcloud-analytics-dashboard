import { withErrorHandler } from '@/lib/utils/api-handler';
import { computeTeamUsage, computeCostByModel, computeTopUsers } from '@/lib/analytics/teams';
import { agents, runs, users } from '@/lib/mock-data';

export const GET = withErrorHandler(() => ({
  teamUsage: computeTeamUsage(runs, agents, users),
  costByModel: computeCostByModel(runs, agents),
  topUsers: computeTopUsers(runs, users),
}));
