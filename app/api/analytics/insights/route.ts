import { withErrorHandler } from '@/lib/utils/api-handler';
import { generateInsights } from '@/lib/analytics/insights';
import { agents, runs } from '@/lib/mock-data';

export const GET = withErrorHandler(() => ({
  insights: generateInsights(runs, agents),
}));
