import { parseDateParams } from '@/lib/utils/date-filter';
import { getInsights } from './insights.service';
import type { InsightsResponse } from '@/lib/types';

export function handleInsightsRequest(request: Request): InsightsResponse {
  const { from, to } = parseDateParams(request);
  return getInsights(from, to);
}
