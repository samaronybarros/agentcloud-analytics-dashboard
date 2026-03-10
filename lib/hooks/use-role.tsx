'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import type { UserRole } from '@/lib/types';

const VALID_ROLES: ReadonlySet<string> = new Set<UserRole>(['admin', 'manager', 'engineer']);
const DEFAULT_ROLE: UserRole = 'engineer';

function parseRoleParam(value: string | null): UserRole {
  if (value && VALID_ROLES.has(value)) {
    return value as UserRole;
  }
  return DEFAULT_ROLE;
}

/**
 * Reads the user role from the `?role=` URL search parameter.
 * Defaults to 'engineer' (least-privileged) when absent or invalid.
 * To switch roles, navigate with a different `?role=` value.
 */
export function useRole(): { role: UserRole } {
  const searchParams = useSearchParams();
  const role = useMemo(
    () => parseRoleParam(searchParams.get('role')),
    [searchParams],
  );
  return { role };
}
