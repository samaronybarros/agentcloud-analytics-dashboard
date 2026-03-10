import { parseDateParams } from '@/lib/utils/date-filter';
import { getTroubleshooting } from './troubleshooting.service';
import type { UserRole, TroubleshootingResponse } from '@/lib/types';

export function handleTroubleshootingRequest(request: Request, _role: UserRole): TroubleshootingResponse {
  const { from, to } = parseDateParams(request);
  return getTroubleshooting(from, to);
}
