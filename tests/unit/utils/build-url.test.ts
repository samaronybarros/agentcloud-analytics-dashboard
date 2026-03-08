import { buildUrl } from '@/lib/utils/build-url';

describe('buildUrl', () => {
  it('returns path unchanged when no range provided', () => {
    expect(buildUrl('/api/analytics/overview')).toBe('/api/analytics/overview');
  });

  it('returns path unchanged when range is undefined', () => {
    expect(buildUrl('/api/analytics/overview', undefined)).toBe('/api/analytics/overview');
  });

  it('returns path unchanged when range is empty object', () => {
    expect(buildUrl('/api/analytics/overview', {})).toBe('/api/analytics/overview');
  });

  it('appends from param only', () => {
    expect(buildUrl('/api/analytics/overview', { from: '2026-03-01' })).toBe(
      '/api/analytics/overview?from=2026-03-01',
    );
  });

  it('appends to param only', () => {
    expect(buildUrl('/api/analytics/overview', { to: '2026-03-15' })).toBe(
      '/api/analytics/overview?to=2026-03-15',
    );
  });

  it('appends both from and to params', () => {
    const result = buildUrl('/api/analytics/overview', { from: '2026-03-01', to: '2026-03-15' });
    expect(result).toBe('/api/analytics/overview?from=2026-03-01&to=2026-03-15');
  });

  it('works with different path prefixes', () => {
    expect(buildUrl('/api/analytics/agents', { from: '2026-03-01' })).toBe(
      '/api/analytics/agents?from=2026-03-01',
    );
  });
});
