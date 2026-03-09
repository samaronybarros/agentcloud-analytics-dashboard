import { parseDateParams } from '@/lib/utils/date-filter';
import { getTeamAnalytics } from './teams.service';
import type { TeamsResponse } from '@/lib/types';

export function handleTeamsRequest(request: Request): TeamsResponse {
  const { from, to } = parseDateParams(request);
  return getTeamAnalytics(from, to);
}
