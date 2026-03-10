'use client';

import { useRole } from '@/lib/hooks/use-role';
import type { UserRole } from '@/lib/types';

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Org Admin' },
  { value: 'manager', label: 'Eng Manager' },
  { value: 'engineer', label: 'Platform Engineer' },
];

const VALID_ROLES: ReadonlySet<string> = new Set<UserRole>(['admin', 'manager', 'engineer']);

function isUserRole(value: string): value is UserRole {
  return VALID_ROLES.has(value);
}

export function RoleSelector() {
  const { role, setRole } = useRole();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="role-selector" className="text-sm text-gray-500">
        Viewing as
      </label>
      <select
        id="role-selector"
        value={role}
        onChange={(e) => {
          const value = e.target.value;
          if (isUserRole(value)) setRole(value);
        }}
        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {ROLES.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
