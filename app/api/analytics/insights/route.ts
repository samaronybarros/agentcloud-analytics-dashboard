import { withErrorHandler } from '@/lib/utils/api-handler';
import { handleInsightsRequest } from './insights.controller';

export const GET = withErrorHandler(handleInsightsRequest);
