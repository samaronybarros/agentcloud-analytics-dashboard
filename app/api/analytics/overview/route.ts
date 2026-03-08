import { withErrorHandler } from '@/lib/utils/api-handler';
import { filterRunsByDateRange, parseDateParams } from '@/lib/utils/date-filter';
import { computeOverviewKPIs } from '@/lib/analytics/overview';
import { agents, runs, users } from '@/lib/mock-data';

export const GET = withErrorHandler((request) => {
  const { from, to } = parseDateParams(request);
  const filtered = filterRunsByDateRange(runs, from, to);
  return computeOverviewKPIs(filtered, agents, users);
});
