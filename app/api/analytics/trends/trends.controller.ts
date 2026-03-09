import { parseDateParams } from '@/lib/utils/date-filter';
import { getTrends } from './trends.service';
import type { TrendsResponse } from '@/lib/types';

export function handleTrendsRequest(request: Request): TrendsResponse {
  const { from, to } = parseDateParams(request);
  return getTrends(from, to);
}
