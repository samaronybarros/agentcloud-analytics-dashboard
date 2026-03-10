/**
 * Simple in-memory token bucket rate limiter.
 * Tracks request counts per client key within a sliding window.
 * No external dependencies.
 */

export interface RateLimiterConfig {
  windowMs: number;
  maxRequests: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterMs?: number;
}

interface ClientBucket {
  tokens: number;
  lastRefillTimestamp: number;
}

const DEFAULT_CONFIG: RateLimiterConfig = {
  windowMs: 60_000,
  maxRequests: 100,
};

/**
 * Creates a rate limiter instance with the given configuration.
 * Returns a checkRateLimit function scoped to its own bucket store.
 */
export function createRateLimiter(config: Partial<RateLimiterConfig> = {}) {
  const resolvedConfig: RateLimiterConfig = { ...DEFAULT_CONFIG, ...config };
  const buckets = new Map<string, ClientBucket>();

  /**
   * Checks whether a request from the given client key is allowed.
   * Refills tokens proportionally based on elapsed time since last refill.
   */
  function checkRateLimit(key: string): RateLimitResult {
    const now = Date.now();
    const existing = buckets.get(key);

    if (!existing) {
      buckets.set(key, { tokens: resolvedConfig.maxRequests - 1, lastRefillTimestamp: now });
      return { allowed: true };
    }

    const elapsed = now - existing.lastRefillTimestamp;
    const refillAmount = (elapsed / resolvedConfig.windowMs) * resolvedConfig.maxRequests;
    const newTokens = Math.min(resolvedConfig.maxRequests, existing.tokens + refillAmount);

    existing.lastRefillTimestamp = now;
    existing.tokens = newTokens;

    if (existing.tokens < 1) {
      const tokensNeeded = 1 - existing.tokens;
      const retryAfterMs = Math.ceil((tokensNeeded / resolvedConfig.maxRequests) * resolvedConfig.windowMs);
      return { allowed: false, retryAfterMs };
    }

    existing.tokens -= 1;
    return { allowed: true };
  }

  /**
   * Resets all client buckets. Useful for testing.
   */
  function reset(): void {
    buckets.clear();
  }

  return { checkRateLimit, reset };
}

/**
 * Extracts a client identifier from a request for rate limiting.
 * Uses X-Forwarded-For header, falls back to a default key.
 */
export function extractClientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  return 'anonymous';
}
