import { withErrorHandler } from '@/lib/utils/api-handler';
import { handleAgentsRequest } from './agents.controller';

export const GET = withErrorHandler(handleAgentsRequest);
