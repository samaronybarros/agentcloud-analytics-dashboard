/**
 * @jest-environment node
 */
import { withErrorHandler, _resetRateLimiter } from '@/lib/utils/api-handler';

function makeRequest(url = 'http://localhost/api/test'): Request {
  return new Request(url);
}

describe('withErrorHandler', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    _resetRateLimiter();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('returns a function', () => {
    const handler = withErrorHandler(() => ({ foo: 'bar' }));
    expect(typeof handler).toBe('function');
  });

  it('returns 200 with JSON data on success', async () => {
    const handler = withErrorHandler(() => ({ foo: 'bar' }));
    const response = handler(makeRequest());
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ foo: 'bar' });
  });

  it('returns 500 with error message when handler throws', async () => {
    const handler = withErrorHandler(() => {
      throw new Error('Something broke');
    });
    const response = handler(makeRequest());
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Internal server error');
  });

  it('does not leak error details in response', async () => {
    const handler = withErrorHandler(() => {
      throw new Error('secret database credentials');
    });
    const response = handler(makeRequest());
    const data = await response.json();
    expect(JSON.stringify(data)).not.toContain('secret');
    expect(JSON.stringify(data)).not.toContain('database');
  });

  it('handles non-Error throws', async () => {
    const handler = withErrorHandler(() => {
      throw 'string error';
    });
    const response = handler(makeRequest());
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('Internal server error');
  });

  it('returns 403 with Forbidden message when ForbiddenError is thrown', async () => {
    const { ForbiddenError } = await import('@/lib/utils/role-auth');
    const handler = withErrorHandler(() => {
      throw new ForbiddenError('access denied');
    });
    const response = handler(makeRequest());
    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error).toBe('Forbidden');
  });

  it('does not leak ForbiddenError message in response', async () => {
    const { ForbiddenError } = await import('@/lib/utils/role-auth');
    const handler = withErrorHandler(() => {
      throw new ForbiddenError('secret role info');
    });
    const response = handler(makeRequest());
    const data = await response.json();
    expect(JSON.stringify(data)).not.toContain('secret');
  });

  it('passes the request to the handler function', async () => {
    const handler = withErrorHandler((req: Request) => {
      const url = new URL(req.url);
      return { from: url.searchParams.get('from') };
    });
    const response = handler(makeRequest('http://localhost/api/test?from=2026-03-01'));
    const data = await response.json();
    expect(data).toEqual({ from: '2026-03-01' });
  });

  // --- Logging tests ---

  describe('structured logging', () => {
    const envBackup = process.env;

    beforeEach(() => {
      process.env = { ...envBackup, NODE_ENV: 'development' };
    });

    afterEach(() => {
      process.env = envBackup;
    });

    it('logs every successful request as structured JSON', async () => {
      const handler = withErrorHandler(() => ({ ok: true }));
      handler(makeRequest('http://localhost/api/analytics/overview?role=admin'));

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      const logEntry = JSON.parse(consoleSpy.mock.calls[0][0]);
      expect(logEntry.method).toBe('GET');
      expect(logEntry.path).toBe('/api/analytics/overview');
      expect(logEntry.status).toBe(200);
      expect(logEntry.role).toBe('admin');
      expect(logEntry.requestId).toBeDefined();
      expect(typeof logEntry.durationMs).toBe('number');
      expect(logEntry.timestamp).toBeDefined();
    });

    it('logs error requests with correct status', async () => {
      const handler = withErrorHandler(() => {
        throw new Error('fail');
      });
      handler(makeRequest());

      const logEntry = JSON.parse(consoleSpy.mock.calls[0][0]);
      expect(logEntry.status).toBe(500);
    });

    it('logs 403 for ForbiddenError', async () => {
      const { ForbiddenError } = await import('@/lib/utils/role-auth');
      const handler = withErrorHandler(() => {
        throw new ForbiddenError('nope');
      });
      handler(makeRequest());

      const logEntry = JSON.parse(consoleSpy.mock.calls[0][0]);
      expect(logEntry.status).toBe(403);
    });
  });

  // --- Request ID tests ---

  describe('request ID', () => {
    it('sets X-Request-Id header on success response', () => {
      const handler = withErrorHandler(() => ({ ok: true }));
      const response = handler(makeRequest());

      const requestId = response.headers.get('X-Request-Id');
      expect(requestId).toBeDefined();
      expect(requestId!.length).toBeGreaterThan(0);
    });

    it('sets X-Request-Id header on error response', () => {
      const handler = withErrorHandler(() => {
        throw new Error('fail');
      });
      const response = handler(makeRequest());

      const requestId = response.headers.get('X-Request-Id');
      expect(requestId).toBeDefined();
      expect(requestId!.length).toBeGreaterThan(0);
    });

    it('includes requestId in error response body', async () => {
      const handler = withErrorHandler(() => {
        throw new Error('fail');
      });
      const response = handler(makeRequest());
      const data = await response.json();

      expect(data.requestId).toBeDefined();
      expect(data.requestId).toBe(response.headers.get('X-Request-Id'));
    });

    it('includes requestId in 403 response body', async () => {
      const { ForbiddenError } = await import('@/lib/utils/role-auth');
      const handler = withErrorHandler(() => {
        throw new ForbiddenError('nope');
      });
      const response = handler(makeRequest());
      const data = await response.json();

      expect(data.requestId).toBeDefined();
    });
  });

  // --- Rate limiting tests ---

  describe('rate limiting', () => {
    it('returns 429 when rate limit is exceeded', async () => {
      // The default limiter allows 100 requests per 60s.
      // We need to exhaust it. Use the shared limiter via many requests.
      const handler = withErrorHandler(() => ({ ok: true }));

      // Make 100 requests (all should succeed)
      for (let i = 0; i < 100; i++) {
        const response = handler(makeRequest());
        expect(response.status).toBe(200);
      }

      // 101st request should be rate-limited
      const rateLimitedResponse = handler(makeRequest());
      expect(rateLimitedResponse.status).toBe(429);

      const data = await rateLimitedResponse.json();
      expect(data.error).toBe('Too Many Requests');
      expect(data.requestId).toBeDefined();
    });

    it('includes Retry-After header on 429 response', async () => {
      const handler = withErrorHandler(() => ({ ok: true }));

      // Exhaust rate limit
      for (let i = 0; i < 100; i++) {
        handler(makeRequest());
      }

      const rateLimitedResponse = handler(makeRequest());
      const retryAfter = rateLimitedResponse.headers.get('Retry-After');
      expect(retryAfter).toBeDefined();
      expect(Number(retryAfter)).toBeGreaterThan(0);
    });

    it('includes X-Request-Id header on 429 response', async () => {
      const handler = withErrorHandler(() => ({ ok: true }));

      for (let i = 0; i < 100; i++) {
        handler(makeRequest());
      }

      const rateLimitedResponse = handler(makeRequest());
      expect(rateLimitedResponse.headers.get('X-Request-Id')).toBeDefined();
    });

    it('logs rate-limited requests with 429 status', async () => {
      const envBackup = process.env;
      process.env = { ...envBackup, NODE_ENV: 'development' };

      const handler = withErrorHandler(() => ({ ok: true }));

      for (let i = 0; i < 100; i++) {
        handler(makeRequest());
      }

      consoleSpy.mockClear();
      handler(makeRequest());

      const logEntry = JSON.parse(consoleSpy.mock.calls[0][0]);
      expect(logEntry.status).toBe(429);

      process.env = envBackup;
    });
  });
});
