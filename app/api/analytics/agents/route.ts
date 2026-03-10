import { withErrorHandler } from '@/lib/utils/api-handler';
import { withRoleAccess } from '@/lib/utils/role-auth';
import { handleAgentsRequest } from './agents.controller';

export const GET = withErrorHandler(withRoleAccess('agents', handleAgentsRequest));
