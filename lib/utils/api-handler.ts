import { NextResponse } from 'next/server';

/**
 * Higher-order function that wraps an API route handler with error handling.
 * Passes the incoming Request to the handler so it can read query parameters.
 * Returns structured JSON on both success and failure.
 */
export function withErrorHandler<T>(
  fn: (request: Request) => T,
): (request: Request) => NextResponse {
  return (request: Request) => {
    try {
      const data = fn(request);
      return NextResponse.json(data);
    } catch {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }
  };
}
