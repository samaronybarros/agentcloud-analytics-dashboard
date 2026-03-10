import { parseDateParams } from '@/lib/utils/date-filter';
import { getModelAnalytics } from './models.service';
import { redactModelsResponse } from '@/lib/utils/response-redaction';
import type { UserRole } from '@/lib/types';

export function handleModelsRequest(request: Request, role: UserRole): object {
  const { from, to } = parseDateParams(request);
  const data = getModelAnalytics(from, to);
  return redactModelsResponse(data, role);
}
