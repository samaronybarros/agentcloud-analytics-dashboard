import { parseDateParams } from '@/lib/utils/date-filter';
import { getModelAnalytics } from './models.service';
import type { ModelsResponse } from '@/lib/types';

export function handleModelsRequest(request: Request): ModelsResponse {
  const { from, to } = parseDateParams(request);
  return getModelAnalytics(from, to);
}
