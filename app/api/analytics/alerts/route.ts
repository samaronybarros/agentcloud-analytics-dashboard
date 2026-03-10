import { withErrorHandler } from '@/lib/utils/api-handler';
import { withRoleAccess } from '@/lib/utils/role-auth';
import { handleAlertsRequest } from './alerts.controller';

export const GET = withErrorHandler(withRoleAccess('alerts', handleAlertsRequest));
