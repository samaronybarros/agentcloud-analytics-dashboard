import { withErrorHandler } from '@/lib/utils/api-handler';
import { handleTeamsRequest } from './teams.controller';

export const GET = withErrorHandler(handleTeamsRequest);
