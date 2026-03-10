import { parseDateParams } from '@/lib/utils/date-filter';
import { getTeamAnalytics } from './teams.service';
import { redactTeamsResponse } from '@/lib/utils/response-redaction';
import type { UserRole } from '@/lib/types';

export function handleTeamsRequest(request: Request, role: UserRole): object {
  const { from, to } = parseDateParams(request);
  const data = getTeamAnalytics(from, to);
  return redactTeamsResponse(data, role);
}
