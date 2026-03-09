/**
 * @jest-environment node
 */
import { parseDateParams } from '@/lib/utils/date-filter';

function makeRequest(params = ''): Request {
  return new Request(`http://localhost/api/test${params}`);
}

describe('parseDateParams', () => {
  it('returns undefined for both when no params', () => {
    const { from, to } = parseDateParams(makeRequest());
    expect(from).toBeUndefined();
    expect(to).toBeUndefined();
  });

  it('parses from param', () => {
    const { from, to } = parseDateParams(makeRequest('?from=2026-03-01'));
    expect(from).toBe('2026-03-01');
    expect(to).toBeUndefined();
  });

  it('parses to param', () => {
    const { from, to } = parseDateParams(makeRequest('?to=2026-03-15'));
    expect(from).toBeUndefined();
    expect(to).toBe('2026-03-15');
  });

  it('parses both from and to', () => {
    const { from, to } = parseDateParams(makeRequest('?from=2026-03-01&to=2026-03-15'));
    expect(from).toBe('2026-03-01');
    expect(to).toBe('2026-03-15');
  });

  it('ignores invalid date formats', () => {
    const { from, to } = parseDateParams(makeRequest('?from=invalid&to=2026/03/15'));
    expect(from).toBeUndefined();
    expect(to).toBeUndefined();
  });

  it('ignores extra params', () => {
    const { from, to } = parseDateParams(makeRequest('?from=2026-03-01&extra=foo'));
    expect(from).toBe('2026-03-01');
    expect(to).toBeUndefined();
  });
});
