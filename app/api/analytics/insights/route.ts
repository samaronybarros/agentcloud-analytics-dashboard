import { withErrorHandler } from '@/lib/utils/api-handler';
import { withRoleAccess } from '@/lib/utils/role-auth';
import { handleInsightsRequest } from './insights.controller';

export const GET = withErrorHandler(withRoleAccess('optimization', handleInsightsRequest));
