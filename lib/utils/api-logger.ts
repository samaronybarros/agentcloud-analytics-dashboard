/**
 * Structured JSON logger for the API layer.
 * Outputs log entries with consistent shape for observability.
 * No external dependencies — uses only built-in APIs.
 */

export interface ApiLogEntry {
  timestamp: string;
  method: string;
  path: string;
  status: number;
  durationMs: number;
  role: string | null;
  requestId: string;
}

/**
 * Generates a unique request identifier.
 * Uses crypto.randomUUID() when available, falls back to a timestamp-based ID.
 */
export function generateRequestId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `req-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Logs a structured JSON entry for an API request.
 * Designed to be called after the response is prepared, with timing data.
 */
export function logApiRequest(entry: ApiLogEntry): void {
  if (process.env.NODE_ENV === 'test') return;
  const logLine = JSON.stringify(entry);
  console.log(logLine);
}

/**
 * Extracts relevant metadata from a Request for logging purposes.
 */
export function extractRequestMeta(request: Request): { method: string; path: string; role: string | null } {
  const url = new URL(request.url);
  const method = request.method;
  const path = url.pathname;
  const role = url.searchParams.get('role') || request.headers.get('x-user-role') || null;

  return { method, path, role };
}
