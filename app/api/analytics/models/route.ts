import { withErrorHandler } from '@/lib/utils/api-handler';
import { handleModelsRequest } from './models.controller';

export const GET = withErrorHandler(handleModelsRequest);
