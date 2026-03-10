import { parseDateParams } from '@/lib/utils/date-filter';
import { getTrends } from './trends.service';
import { redactTrendsResponse } from '@/lib/utils/response-redaction';
import type { UserRole } from '@/lib/types';

export function handleTrendsRequest(request: Request, role: UserRole): object {
  const { from, to } = parseDateParams(request);
  const data = getTrends(from, to);
  return redactTrendsResponse(data, role);
}
