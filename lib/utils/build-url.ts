import type { DateRange } from '@/lib/types';

/**
 * Appends optional date range query parameters to an API path.
 */
export function buildUrl(path: string, range?: DateRange): string {
  const params = new URLSearchParams();
  if (range?.from) params.set('from', range.from);
  if (range?.to) params.set('to', range.to);
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}
