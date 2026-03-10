import { parseDateParams } from '@/lib/utils/date-filter';
import { getAlerts } from './alerts.service';
import { redactAlertsResponse } from '@/lib/utils/response-redaction';
import type { UserRole } from '@/lib/types';

export function handleAlertsRequest(request: Request, role: UserRole): object {
  const { from, to } = parseDateParams(request);
  const data = getAlerts(from, to);
  return redactAlertsResponse(data, role);
}
