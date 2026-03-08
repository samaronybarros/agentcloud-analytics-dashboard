/** Format a number with locale-aware separators */
export function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

/** Format a dollar amount */
export function formatCost(n: number): string {
  return `$${n.toFixed(2)}`;
}

/** Format a percentage (0–1) as "XX.X%" */
export function formatPercent(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

/** Format milliseconds as human-readable */
export function formatLatency(ms: number): string {
  return `${Math.round(ms).toLocaleString('en-US')}ms`;
}
