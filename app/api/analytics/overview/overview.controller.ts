import { parseDateParams } from '@/lib/utils/date-filter';
import { getOverviewKPIs } from './overview.service';
import { redactOverviewResponse } from '@/lib/utils/response-redaction';
import type { UserRole } from '@/lib/types';

export function handleOverviewRequest(request: Request, role: UserRole): object {
  const { from, to } = parseDateParams(request);
  const data = getOverviewKPIs(from, to);
  return redactOverviewResponse(data, role);
}
