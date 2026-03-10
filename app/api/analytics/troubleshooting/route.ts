import { withErrorHandler } from '@/lib/utils/api-handler';
import { handleTroubleshootingRequest } from './troubleshooting.controller';

export const GET = withErrorHandler(handleTroubleshootingRequest);
