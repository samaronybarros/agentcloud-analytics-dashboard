import { NextResponse } from 'next/server';
import { ForbiddenError } from '@/lib/utils/role-auth';
import { generateRequestId, logApiRequest, extractRequestMeta } from '@/lib/utils/api-logger';
import { createRateLimiter, extractClientKey } from '@/lib/utils/rate-limiter';

/**
 * Shared rate limiter instance for all API routes.
 * 100 requests per 60 seconds per client (default config).
 */
const rateLimiter = createRateLimiter();

/**
 * Higher-order function that wraps an API route handler with:
 * - Structured request logging (JSON)
 * - Request ID generation and X-Request-Id header
 * - Rate limiting (in-memory token bucket)
 * - Error handling with safe error messages
 *
 * Passes the incoming Request to the handler so it can read query parameters.
 * Returns structured JSON on both success and failure.
 *
 * Handles ForbiddenError specifically to return 403 status.
 */
export function withErrorHandler<T extends object>(
  fn: (request: Request) => T,
): (request: Request) => NextResponse {
  return (request: Request) => {
    const requestId = generateRequestId();
    const startTime = Date.now();
    const { method, path, role } = extractRequestMeta(request);

    // Check rate limit
    const clientKey = extractClientKey(request);
    const rateLimitResult = rateLimiter.checkRateLimit(clientKey);

    if (!rateLimitResult.allowed) {
      const durationMs = Date.now() - startTime;
      logApiRequest({ timestamp: new Date().toISOString(), method, path, status: 429, durationMs, role, requestId });

      const retryAfterSeconds = Math.ceil((rateLimitResult.retryAfterMs ?? 1000) / 1000);
      return NextResponse.json(
        { error: 'Too Many Requests', requestId },
        {
          status: 429,
          headers: {
            'X-Request-Id': requestId,
            'Retry-After': String(retryAfterSeconds),
          },
        },
      );
    }

    try {
      const data = fn(request);
      const durationMs = Date.now() - startTime;
      logApiRequest({ timestamp: new Date().toISOString(), method, path, status: 200, durationMs, role, requestId });

      return NextResponse.json(data, {
        headers: { 'X-Request-Id': requestId },
      });
    } catch (error) {
      const durationMs = Date.now() - startTime;

      if (error instanceof ForbiddenError) {
        logApiRequest({ timestamp: new Date().toISOString(), method, path, status: 403, durationMs, role, requestId });
        return NextResponse.json(
          { error: 'Forbidden', requestId },
          { status: 403, headers: { 'X-Request-Id': requestId } },
        );
      }

      logApiRequest({ timestamp: new Date().toISOString(), method, path, status: 500, durationMs, role, requestId });
      return NextResponse.json(
        { error: 'Internal server error', requestId },
        { status: 500, headers: { 'X-Request-Id': requestId } },
      );
    }
  };
}

/**
 * Exported for testing: resets the shared rate limiter state.
 */
export const _resetRateLimiter = rateLimiter.reset;
