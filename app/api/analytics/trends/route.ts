import { withErrorHandler } from '@/lib/utils/api-handler';
import { computeRunsTrend, computeLatencyTrend, computeCostTrend } from '@/lib/analytics/trends';
import { runs } from '@/lib/mock-data';

export const GET = withErrorHandler(() => ({
  runsTrend: computeRunsTrend(runs),
  latencyTrend: computeLatencyTrend(runs),
  costTrend: computeCostTrend(runs),
}));
