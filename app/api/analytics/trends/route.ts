import { withErrorHandler } from '@/lib/utils/api-handler';
import { withRoleAccess } from '@/lib/utils/role-auth';
import { handleTrendsRequest } from './trends.controller';

// Trends data serves the overview page's charts — use 'overview' for page access check
export const GET = withErrorHandler(withRoleAccess('overview', handleTrendsRequest));
