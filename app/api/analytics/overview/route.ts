import { withErrorHandler } from '@/lib/utils/api-handler';
import { handleOverviewRequest } from './overview.controller';

export const GET = withErrorHandler(handleOverviewRequest);
