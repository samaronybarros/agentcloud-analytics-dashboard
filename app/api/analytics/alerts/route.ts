import { withErrorHandler } from '@/lib/utils/api-handler';
import { handleAlertsRequest } from './alerts.controller';

export const GET = withErrorHandler(handleAlertsRequest);
