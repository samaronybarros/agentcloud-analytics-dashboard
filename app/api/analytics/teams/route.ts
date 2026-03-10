import { withErrorHandler } from '@/lib/utils/api-handler';
import { withRoleAccess } from '@/lib/utils/role-auth';
import { handleTeamsRequest } from './teams.controller';

export const GET = withErrorHandler(withRoleAccess('teams', handleTeamsRequest));
