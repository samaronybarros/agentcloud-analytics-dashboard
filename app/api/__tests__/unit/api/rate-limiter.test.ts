/**
 * @jest-environment node
 */
import { createRateLimiter, extractClientKey } from '@/lib/utils/rate-limiter';

describe('rate-limiter', () => {
  describe('createRateLimiter', () => {
    it('allows requests within the limit', () => {
      const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 5 });

      for (let i = 0; i < 5; i++) {
        const result = limiter.checkRateLimit('client-a');
        expect(result.allowed).toBe(true);
      }
    });

    it('blocks requests exceeding the limit', () => {
      const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 3 });

      limiter.checkRateLimit('client-b');
      limiter.checkRateLimit('client-b');
      limiter.checkRateLimit('client-b');

      const result = limiter.checkRateLimit('client-b');
      expect(result.allowed).toBe(false);
      expect(result.retryAfterMs).toBeDefined();
      expect(result.retryAfterMs).toBeGreaterThan(0);
    });

    it('tracks clients independently', () => {
      const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 2 });

      limiter.checkRateLimit('client-x');
      limiter.checkRateLimit('client-x');

      const blockedResult = limiter.checkRateLimit('client-x');
      expect(blockedResult.allowed).toBe(false);

      const otherResult = limiter.checkRateLimit('client-y');
      expect(otherResult.allowed).toBe(true);
    });

    it('refills tokens over time', () => {
      const limiter = createRateLimiter({ windowMs: 1000, maxRequests: 2 });

      limiter.checkRateLimit('client-c');
      limiter.checkRateLimit('client-c');

      const blocked = limiter.checkRateLimit('client-c');
      expect(blocked.allowed).toBe(false);

      // Simulate time passing by manipulating Date.now
      const originalNow = Date.now;
      Date.now = () => originalNow() + 1100;

      const afterRefill = limiter.checkRateLimit('client-c');
      expect(afterRefill.allowed).toBe(true);

      Date.now = originalNow;
    });

    it('resets all buckets when reset is called', () => {
      const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 1 });

      limiter.checkRateLimit('client-d');
      const blocked = limiter.checkRateLimit('client-d');
      expect(blocked.allowed).toBe(false);

      limiter.reset();

      const afterReset = limiter.checkRateLimit('client-d');
      expect(afterReset.allowed).toBe(true);
    });

    it('uses default config when no config provided', () => {
      const limiter = createRateLimiter();

      // Should allow at least several requests with default 100/60s
      for (let i = 0; i < 50; i++) {
        const result = limiter.checkRateLimit('client-e');
        expect(result.allowed).toBe(true);
      }
    });

    it('returns retryAfterMs that reflects remaining wait time', () => {
      const limiter = createRateLimiter({ windowMs: 10_000, maxRequests: 1 });

      limiter.checkRateLimit('client-f');
      const blocked = limiter.checkRateLimit('client-f');

      expect(blocked.allowed).toBe(false);
      expect(blocked.retryAfterMs).toBeGreaterThan(0);
      expect(blocked.retryAfterMs).toBeLessThanOrEqual(10_000);
    });
  });

  describe('extractClientKey', () => {
    it('extracts IP from x-forwarded-for header', () => {
      const request = new Request('http://localhost/api/test', {
        headers: { 'x-forwarded-for': '192.168.1.1, 10.0.0.1' },
      });
      expect(extractClientKey(request)).toBe('192.168.1.1');
    });

    it('extracts IP from x-real-ip header', () => {
      const request = new Request('http://localhost/api/test', {
        headers: { 'x-real-ip': '10.0.0.5' },
      });
      expect(extractClientKey(request)).toBe('10.0.0.5');
    });

    it('prefers x-forwarded-for over x-real-ip', () => {
      const request = new Request('http://localhost/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.1',
          'x-real-ip': '10.0.0.5',
        },
      });
      expect(extractClientKey(request)).toBe('192.168.1.1');
    });

    it('returns anonymous when no IP headers present', () => {
      const request = new Request('http://localhost/api/test');
      expect(extractClientKey(request)).toBe('anonymous');
    });

    it('trims whitespace from forwarded header', () => {
      const request = new Request('http://localhost/api/test', {
        headers: { 'x-forwarded-for': '  192.168.1.1  , 10.0.0.1' },
      });
      expect(extractClientKey(request)).toBe('192.168.1.1');
    });
  });
});
