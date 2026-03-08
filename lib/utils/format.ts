/** Format a number with locale-aware separators */
export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return '0';
  return n.toLocaleString('en-US');
}

/** Format a dollar amount */
export function formatCost(n: number): string {
  if (!Number.isFinite(n)) return '$0.00';
  return `$${n.toFixed(2)}`;
}

/** Format a percentage (0–1) as "XX.X%" */
export function formatPercent(n: number): string {
  if (!Number.isFinite(n)) return '0.0%';
  return `${(n * 100).toFixed(1)}%`;
}

/** Format milliseconds as human-readable */
export function formatLatency(ms: number): string {
  if (!Number.isFinite(ms)) return '0ms';
  return `${Math.round(ms).toLocaleString('en-US')}ms`;
}
