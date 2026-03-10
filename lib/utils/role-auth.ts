import type { UserRole } from '@/lib/types';
import { canAccessPage } from '@/lib/role-visibility';
import type { DashboardPage } from '@/lib/role-visibility';

const VALID_ROLES: readonly string[] = ['admin', 'manager', 'engineer'];

/**
 * Custom error for authorization failures.
 * Caught by withErrorHandler to return 403 instead of 500.
 */
export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
  }
}

/**
 * Extracts the user role from the request.
 * Checks `role` query parameter first, then `X-User-Role` header.
 * Defaults to 'engineer' (least-privileged) when no valid role is provided.
 */
export function parseRole(request: Request): UserRole {
  const url = new URL(request.url);
  const queryRole = url.searchParams.get('role');
  const headerRole = request.headers.get('x-user-role');
  const raw = queryRole || headerRole;

  if (raw && VALID_ROLES.includes(raw)) {
    return raw as UserRole;
  }
  return 'engineer';
}

/**
 * Higher-order function that enforces page-level access control.
 * Extracts the role from the request, checks access via role-visibility config,
 * and passes the role to the handler for field-level redaction.
 *
 * Throws ForbiddenError if the role cannot access the page.
 */
export function withRoleAccess<T extends object>(
  page: DashboardPage,
  handler: (request: Request, role: UserRole) => T,
): (request: Request) => T {
  return (request: Request) => {
    const role = parseRole(request);
    if (!canAccessPage(role, page)) {
      throw new ForbiddenError(
        `Role '${role}' cannot access '${page}'`,
      );
    }
    return handler(request, role);
  };
}
