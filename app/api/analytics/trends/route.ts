import { withErrorHandler } from '@/lib/utils/api-handler';
import { handleTrendsRequest } from './trends.controller';

export const GET = withErrorHandler(handleTrendsRequest);
