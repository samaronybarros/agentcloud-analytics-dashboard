import { withErrorHandler } from '@/lib/utils/api-handler';
import { withRoleAccess } from '@/lib/utils/role-auth';
import { handleOverviewRequest } from './overview.controller';

export const GET = withErrorHandler(withRoleAccess('overview', handleOverviewRequest));
