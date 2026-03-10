import { withErrorHandler } from '@/lib/utils/api-handler';
import { withRoleAccess } from '@/lib/utils/role-auth';
import { handleModelsRequest } from './models.controller';

export const GET = withErrorHandler(withRoleAccess('models', handleModelsRequest));
