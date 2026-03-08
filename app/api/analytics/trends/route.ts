import { withErrorHandler } from '@/lib/utils/api-handler';
import { filterRunsByDateRange, parseDateParams } from '@/lib/utils/date-filter';
import { computeRunsTrend, computeLatencyTrend, computeCostTrend } from '@/lib/analytics/trends';
import { runs } from '@/lib/mock-data';
import type { TrendsResponse } from '@/lib/types';

export const GET = withErrorHandler((request): TrendsResponse => {
  const { from, to } = parseDateParams(request);
  const filtered = filterRunsByDateRange(runs, from, to);
  return {
    runsTrend: computeRunsTrend(filtered),
    latencyTrend: computeLatencyTrend(filtered),
    costTrend: computeCostTrend(filtered),
  };
});
