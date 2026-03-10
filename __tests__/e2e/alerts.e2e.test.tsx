/**
 * E2E-style test for the Alerts page.
 * Mocks at the fetch level — full data flow from API to rendered DOM.
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import type { AlertsResponse } from '@/lib/types';
import { createE2EWrapper, setupFetchMock, jsonResponse, errorResponse } from './helpers';

jest.mock('@/lib/hooks/use-role', () => {
  const actual = jest.requireActual('@/lib/hooks/use-role');
  return {
    ...actual,
    useRole: () => ({ role: 'admin', setRole: jest.fn() }),
  };
});

import AlertsPage from '@/app/dashboard/alerts/page';

const alertsData: AlertsResponse = {
  alerts: [
    {
      id: 'alert-1',
      metric: 'success-rate',
      status: 'breached',
      title: 'Low success rate on Code Generator',
      description: 'Success rate dropped below 80% threshold.',
      currentValue: 0.72,
      threshold: 0.8,
      agentId: 'agent-01',
    },
    {
      id: 'alert-2',
      metric: 'cost',
      status: 'ok',
      title: 'Cost within budget',
      description: 'Total cost remains under the configured limit.',
      currentValue: 350,
      threshold: 500,
    },
  ],
  breachedCount: 1,
};

const fetchMock = setupFetchMock();

function mockSuccessfulFetch() {
  fetchMock.mockImplementation((url: string) => {
    if (url.includes('/api/analytics/alerts')) return Promise.resolve(jsonResponse(alertsData));
    return Promise.resolve(errorResponse(404));
  });
}

describe('Alerts page (e2e)', () => {
  it('renders alerts from API', async () => {
    mockSuccessfulFetch();
    render(<AlertsPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Low success rate on Code Generator')).toBeInTheDocument();
    });

    expect(screen.getByText('Cost within budget')).toBeInTheDocument();
  });

  it('renders breached section', async () => {
    mockSuccessfulFetch();
    render(<AlertsPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Breached' })).toBeInTheDocument();
    });

    expect(screen.getByText('Low success rate on Code Generator')).toBeInTheDocument();
  });

  it('shows loading skeletons before data arrives', () => {
    fetchMock.mockImplementation(() => new Promise(() => {}));
    render(<AlertsPage />, { wrapper: createE2EWrapper() });

    expect(screen.getByRole('heading', { name: 'Alerts' })).toBeInTheDocument();
  });

  it('shows error state when the API fails', async () => {
    fetchMock.mockImplementation(() => Promise.resolve(errorResponse()));
    render(<AlertsPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });
  });

  it('shows empty state when no alerts are returned', async () => {
    const emptyData: AlertsResponse = { alerts: [], breachedCount: 0 };
    fetchMock.mockImplementation((url: string) => {
      if (url.includes('/api/analytics/alerts')) return Promise.resolve(jsonResponse(emptyData));
      return Promise.resolve(errorResponse(404));
    });

    render(<AlertsPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
  });

  it('calls alerts API endpoint', async () => {
    mockSuccessfulFetch();
    render(<AlertsPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Low success rate on Code Generator')).toBeInTheDocument();
    });

    const calledUrls = fetchMock.mock.calls.map((call: unknown[]) => call[0]);
    expect(calledUrls).toContainEqual(expect.stringContaining('/api/analytics/alerts'));
  });
});
