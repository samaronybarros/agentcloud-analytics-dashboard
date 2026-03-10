/**
 * @jest-environment node
 */
import {
  generateRequestId,
  logApiRequest,
  extractRequestMeta,
  type ApiLogEntry,
} from '@/lib/utils/api-logger';

describe('api-logger', () => {
  describe('generateRequestId', () => {
    it('returns a non-empty string', () => {
      const requestId = generateRequestId();
      expect(typeof requestId).toBe('string');
      expect(requestId.length).toBeGreaterThan(0);
    });

    it('returns unique IDs on successive calls', () => {
      const first = generateRequestId();
      const second = generateRequestId();
      expect(first).not.toBe(second);
    });

    it('returns a UUID-format string when crypto.randomUUID is available', () => {
      const requestId = generateRequestId();
      // UUID v4 format: 8-4-4-4-12 hex chars
      expect(requestId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
    });
  });

  describe('logApiRequest', () => {
    const envBackup = process.env;

    beforeEach(() => {
      process.env = { ...envBackup, NODE_ENV: 'development' };
    });

    afterEach(() => {
      process.env = envBackup;
    });

    it('skips logging in test environment', () => {
      process.env = { ...envBackup, NODE_ENV: 'test' };
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      logApiRequest({
        timestamp: '2026-03-10T00:00:00.000Z',
        method: 'GET',
        path: '/api/test',
        status: 200,
        durationMs: 5,
        role: null,
        requestId: 'req-skip',
      });

      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('outputs a JSON string to console.log', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      const entry: ApiLogEntry = {
        timestamp: '2026-03-10T00:00:00.000Z',
        method: 'GET',
        path: '/api/analytics/overview',
        status: 200,
        durationMs: 15,
        role: 'admin',
        requestId: 'test-request-id',
      };

      logApiRequest(entry);

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      const loggedString = consoleSpy.mock.calls[0][0];
      const parsed = JSON.parse(loggedString);
      expect(parsed.method).toBe('GET');
      expect(parsed.path).toBe('/api/analytics/overview');
      expect(parsed.status).toBe(200);
      expect(parsed.durationMs).toBe(15);
      expect(parsed.role).toBe('admin');
      expect(parsed.requestId).toBe('test-request-id');

      consoleSpy.mockRestore();
    });

    it('handles null role', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      const entry: ApiLogEntry = {
        timestamp: '2026-03-10T00:00:00.000Z',
        method: 'POST',
        path: '/api/test',
        status: 500,
        durationMs: 100,
        role: null,
        requestId: 'req-123',
      };

      logApiRequest(entry);

      const parsed = JSON.parse(consoleSpy.mock.calls[0][0]);
      expect(parsed.role).toBeNull();

      consoleSpy.mockRestore();
    });
  });

  describe('extractRequestMeta', () => {
    it('extracts method, path, and role from query parameter', () => {
      const request = new Request('http://localhost/api/analytics/overview?role=admin');
      const meta = extractRequestMeta(request);

      expect(meta.method).toBe('GET');
      expect(meta.path).toBe('/api/analytics/overview');
      expect(meta.role).toBe('admin');
    });

    it('extracts role from x-user-role header when no query param', () => {
      const request = new Request('http://localhost/api/analytics/agents', {
        headers: { 'x-user-role': 'manager' },
      });
      const meta = extractRequestMeta(request);

      expect(meta.role).toBe('manager');
    });

    it('returns null role when no role is provided', () => {
      const request = new Request('http://localhost/api/analytics/teams');
      const meta = extractRequestMeta(request);

      expect(meta.role).toBeNull();
    });

    it('prefers query param role over header', () => {
      const request = new Request('http://localhost/api/test?role=engineer', {
        headers: { 'x-user-role': 'admin' },
      });
      const meta = extractRequestMeta(request);

      expect(meta.role).toBe('engineer');
    });
  });
});
