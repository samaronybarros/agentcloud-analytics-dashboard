import type { DateRange, UserRole } from '@/lib/types';

/**
 * Appends optional date range and role query parameters to an API path.
 */
export function buildUrl(path: string, range?: DateRange, role?: UserRole): string {
  const params = new URLSearchParams();
  if (range?.from) params.set('from', range.from);
  if (range?.to) params.set('to', range.to);
  if (role) params.set('role', role);
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}
