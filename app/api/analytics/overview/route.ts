import { withErrorHandler } from '@/lib/utils/api-handler';
import { computeOverviewKPIs } from '@/lib/analytics/overview';
import { agents, runs, users } from '@/lib/mock-data';

export const GET = withErrorHandler(() =>
  computeOverviewKPIs(runs, agents, users)
);
