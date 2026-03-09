import { parseDateParams } from '@/lib/utils/date-filter';
import { getOverviewKPIs } from './overview.service';
import type { OverviewResponse } from '@/lib/types';

export function handleOverviewRequest(request: Request): OverviewResponse {
  const { from, to } = parseDateParams(request);
  return getOverviewKPIs(from, to);
}
