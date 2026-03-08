import { withErrorHandler } from '@/lib/utils/api-handler';
import { filterRunsByDateRange, parseDateParams } from '@/lib/utils/date-filter';
import { generateInsights } from '@/lib/analytics/insights';
import { agents, runs } from '@/lib/mock-data';
import type { InsightsResponse } from '@/lib/types';

export const GET = withErrorHandler((request): InsightsResponse => {
  const { from, to } = parseDateParams(request);
  const filtered = filterRunsByDateRange(runs, from, to);
  return {
    insights: generateInsights(filtered, agents),
  };
});
