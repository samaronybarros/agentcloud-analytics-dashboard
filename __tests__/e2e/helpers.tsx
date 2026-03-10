/**
 * Shared helpers for e2e-style tests.
 *
 * These tests render full pages with fetch-level mocking, exercising the
 * complete data flow: fetch → React Query → hooks → components → DOM.
 */
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DateRangeProvider } from '@/lib/hooks/use-date-range';
import { RoleProvider } from '@/lib/hooks/use-role';

/**
 * Wraps children with QueryClient + DateRangeProvider + RoleProvider, matching
 * the real DashboardLayout providers without the sidebar/header chrome.
 */
export function createE2EWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function E2EWrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <RoleProvider>
          <DateRangeProvider>
            {children}
          </DateRangeProvider>
        </RoleProvider>
      </QueryClientProvider>
    );
  };
}

/** Sets up global.fetch as a jest.fn() and returns it. Restores in afterEach. */
export function setupFetchMock(): jest.Mock {
  const fetchMock = jest.fn();
  beforeEach(() => {
    global.fetch = fetchMock;
    fetchMock.mockReset();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  return fetchMock;
}

/** Creates a successful fetch Response mock. */
export function jsonResponse(data: unknown): Response {
  return {
    ok: true,
    json: async () => data,
  } as Response;
}

/** Creates a failed fetch Response mock. */
export function errorResponse(status = 500): Response {
  return {
    ok: false,
    status,
    json: async () => ({ error: 'Server Error' }),
  } as Response;
}
