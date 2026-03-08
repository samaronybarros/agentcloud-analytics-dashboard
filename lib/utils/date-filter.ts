import type { Run } from '@/lib/types';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Filters runs by an optional date range (inclusive on both ends).
 * Dates are compared as YYYY-MM-DD strings extracted from the ISO 8601 startedAt field.
 */
export function filterRunsByDateRange(
  runs: readonly Run[],
  from?: string,
  to?: string,
): Run[] {
  if (!from && !to) return [...runs];

  return runs.filter((run) => {
    const date = run.startedAt.slice(0, 10);
    if (from && date < from) return false;
    if (to && date > to) return false;
    return true;
  });
}

/**
 * Extracts and validates `from` and `to` date query parameters from a Request URL.
 * Returns undefined for missing or invalid values (must be YYYY-MM-DD format).
 */
export function parseDateParams(request: Request): { from?: string; to?: string } {
  const url = new URL(request.url);
  const rawFrom = url.searchParams.get('from');
  const rawTo = url.searchParams.get('to');

  return {
    from: rawFrom && DATE_PATTERN.test(rawFrom) ? rawFrom : undefined,
    to: rawTo && DATE_PATTERN.test(rawTo) ? rawTo : undefined,
  };
}
