import { parseDateParams } from '@/lib/utils/date-filter';
import { getTroubleshooting } from './troubleshooting.service';
import type { TroubleshootingResponse } from '@/lib/types';

export function handleTroubleshootingRequest(request: Request): TroubleshootingResponse {
  const { from, to } = parseDateParams(request);
  return getTroubleshooting(from, to);
}
