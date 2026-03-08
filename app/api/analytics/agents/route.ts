import { withErrorHandler } from '@/lib/utils/api-handler';
import { computeAgentLeaderboard, computeFailureTaxonomy } from '@/lib/analytics/agents';
import { agents, runs } from '@/lib/mock-data';

export const GET = withErrorHandler(() => ({
  leaderboard: computeAgentLeaderboard(runs, agents),
  failureTaxonomy: computeFailureTaxonomy(runs),
}));
