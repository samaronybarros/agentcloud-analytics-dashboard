import { parseDateParams } from '@/lib/utils/date-filter';
import { getAgentAnalytics } from './agents.service';
import type { AgentsResponse } from '@/lib/types';

export function handleAgentsRequest(request: Request): AgentsResponse {
  const { from, to } = parseDateParams(request);
  return getAgentAnalytics(from, to);
}
