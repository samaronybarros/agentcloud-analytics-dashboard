import { parseDateParams } from '@/lib/utils/date-filter';
import { getAlerts } from './alerts.service';
import type { AlertsResponse } from '@/lib/types';

export function handleAlertsRequest(request: Request): AlertsResponse {
  const { from, to } = parseDateParams(request);
  return getAlerts(from, to);
}
