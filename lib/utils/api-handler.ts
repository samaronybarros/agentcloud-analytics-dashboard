import { NextResponse } from 'next/server';

/**
 * Higher-order function that wraps an API route handler with error handling.
 * Returns structured JSON on both success and failure.
 */
export function withErrorHandler<T>(fn: () => T): () => NextResponse {
  return () => {
    try {
      const data = fn();
      return NextResponse.json(data);
    } catch {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }
  };
}
