import { withErrorHandler } from '@/lib/utils/api-handler';
import { withRoleAccess } from '@/lib/utils/role-auth';
import { handleTroubleshootingRequest } from './troubleshooting.controller';

export const GET = withErrorHandler(withRoleAccess('troubleshooting', handleTroubleshootingRequest));
