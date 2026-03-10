/**
 * @jest-environment node
 */
import { parseRole, ForbiddenError, withRoleAccess } from '@/lib/utils/role-auth';

function makeRequest(params = '', headers: Record<string, string> = {}): Request {
  const request = new Request(`http://localhost/api/test${params}`);
  for (const [key, value] of Object.entries(headers)) {
    request.headers.set(key, value);
  }
  return request;
}

describe('parseRole', () => {
  it('defaults to engineer when no role is provided', () => {
    expect(parseRole(makeRequest())).toBe('engineer');
  });

  it('reads role from query parameter', () => {
    expect(parseRole(makeRequest('?role=engineer'))).toBe('engineer');
    expect(parseRole(makeRequest('?role=manager'))).toBe('manager');
    expect(parseRole(makeRequest('?role=admin'))).toBe('admin');
  });

  it('reads role from X-User-Role header', () => {
    expect(parseRole(makeRequest('', { 'x-user-role': 'engineer' }))).toBe('engineer');
    expect(parseRole(makeRequest('', { 'x-user-role': 'manager' }))).toBe('manager');
  });

  it('prefers query parameter over header', () => {
    expect(parseRole(makeRequest('?role=manager', { 'x-user-role': 'engineer' }))).toBe('manager');
  });

  it('defaults to engineer for invalid role values', () => {
    expect(parseRole(makeRequest('?role=superadmin'))).toBe('engineer');
    expect(parseRole(makeRequest('?role='))).toBe('engineer');
    expect(parseRole(makeRequest('', { 'x-user-role': 'root' }))).toBe('engineer');
  });
});

describe('ForbiddenError', () => {
  it('has the correct name and message', () => {
    const error = new ForbiddenError('access denied');
    expect(error.name).toBe('ForbiddenError');
    expect(error.message).toBe('access denied');
    expect(error).toBeInstanceOf(Error);
  });
});

describe('withRoleAccess', () => {
  it('passes role to handler when page is accessible', () => {
    const handler = jest.fn().mockReturnValue({ data: 'ok' });
    const wrapped = withRoleAccess('overview', handler);
    const request = makeRequest('?role=admin');
    const result = wrapped(request);
    expect(handler).toHaveBeenCalledWith(request, 'admin');
    expect(result).toEqual({ data: 'ok' });
  });

  it('passes engineer role for accessible pages', () => {
    const handler = jest.fn().mockReturnValue({ data: 'ok' });
    const wrapped = withRoleAccess('overview', handler);
    wrapped(makeRequest('?role=engineer'));
    expect(handler).toHaveBeenCalledWith(expect.any(Request), 'engineer');
  });

  it('throws ForbiddenError when engineer accesses teams', () => {
    const handler = jest.fn();
    const wrapped = withRoleAccess('teams', handler);
    expect(() => wrapped(makeRequest('?role=engineer'))).toThrow(ForbiddenError);
    expect(handler).not.toHaveBeenCalled();
  });

  it('allows admin access to all pages', () => {
    const handler = jest.fn().mockReturnValue({});
    const pages = ['overview', 'agents', 'teams', 'models', 'optimization', 'alerts', 'troubleshooting'] as const;
    for (const page of pages) {
      const wrapped = withRoleAccess(page, handler);
      expect(() => wrapped(makeRequest('?role=admin'))).not.toThrow();
    }
  });

  it('allows manager access to all pages', () => {
    const handler = jest.fn().mockReturnValue({});
    const pages = ['overview', 'agents', 'teams', 'models', 'optimization', 'alerts', 'troubleshooting'] as const;
    for (const page of pages) {
      const wrapped = withRoleAccess(page, handler);
      expect(() => wrapped(makeRequest('?role=manager'))).not.toThrow();
    }
  });

  it('blocks engineer from teams page only', () => {
    const handler = jest.fn().mockReturnValue({});
    const accessible = ['overview', 'agents', 'models', 'optimization', 'alerts', 'troubleshooting'] as const;
    for (const page of accessible) {
      const wrapped = withRoleAccess(page, handler);
      expect(() => wrapped(makeRequest('?role=engineer'))).not.toThrow();
    }
  });
});
