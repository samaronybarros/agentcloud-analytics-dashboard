import { parseDateParams } from '@/lib/utils/date-filter';
import { getInsights } from './insights.service';
import { redactInsightsResponse } from '@/lib/utils/response-redaction';
import type { UserRole } from '@/lib/types';

export function handleInsightsRequest(request: Request, role: UserRole): object {
  const { from, to } = parseDateParams(request);
  const data = getInsights(from, to);
  return redactInsightsResponse(data, role);
}
