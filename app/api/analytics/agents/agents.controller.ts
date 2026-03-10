import { parseDateParams } from '@/lib/utils/date-filter';
import { getAgentAnalytics } from './agents.service';
import { redactAgentsResponse } from '@/lib/utils/response-redaction';
import type { UserRole } from '@/lib/types';

export function handleAgentsRequest(request: Request, role: UserRole): object {
  const { from, to } = parseDateParams(request);
  const data = getAgentAnalytics(from, to);
  return redactAgentsResponse(data, role);
}
