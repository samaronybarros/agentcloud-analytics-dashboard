/**
 * E2E-style test for the Troubleshooting page.
 * Mocks at the fetch level — full data flow from API to rendered DOM.
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import type { TroubleshootingResponse } from '@/lib/types';
import { createE2EWrapper, setupFetchMock, jsonResponse, errorResponse } from './helpers';

jest.mock('recharts', () => {
  const React = require('react');
  const mock = (name: string) =>
    ({ children }: { children?: React.ReactNode }) =>
      React.createElement('div', { 'data-testid': name }, children);
  return {
    ResponsiveContainer: mock('responsive-container'),
    AreaChart: mock('area-chart'),
    Area: mock('area'),
    XAxis: mock('x-axis'),
    YAxis: mock('y-axis'),
    CartesianGrid: mock('cartesian-grid'),
    Tooltip: mock('tooltip'),
  };
});

import TroubleshootingPage from '@/app/dashboard/troubleshooting/page';

const troubleshootingData: TroubleshootingResponse = {
  errorTimeline: [
    { date: '2026-03-01', errors: 5, retries: 3 },
    { date: '2026-03-02', errors: 8, retries: 2 },
  ],
  agentErrors: [
    {
      agentId: 'agent-01',
      agentName: 'CodeReviewer',
      team: 'Platform',
      totalErrors: 10,
      errorsByType: { timeout: 7, 'rate-limit': 3 },
      topErrorType: 'timeout',
      remediation: 'Consider increasing timeout limits.',
    },
    {
      agentId: 'agent-02',
      agentName: 'DataSync',
      team: 'Data',
      totalErrors: 3,
      errorsByType: { 'auth-failure': 3 },
      topErrorType: 'auth-failure',
      remediation: 'Rotate API keys and verify credentials.',
    },
  ],
  totalErrors: 13,
  totalRetries: 5,
};

const fetchMock = setupFetchMock();

function mockSuccessfulFetch() {
  fetchMock.mockImplementation((url: string) => {
    if (url.includes('/api/analytics/troubleshooting')) return Promise.resolve(jsonResponse(troubleshootingData));
    return Promise.resolve(errorResponse(404));
  });
}

describe('Troubleshooting page (e2e)', () => {
  it('renders data from the API', async () => {
    mockSuccessfulFetch();
    render(<TroubleshootingPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByText('CodeReviewer')).toBeInTheDocument();
    });

    expect(screen.getByText('DataSync')).toBeInTheDocument();
    expect(screen.getByText('Platform')).toBeInTheDocument();
    expect(screen.getByText('Data')).toBeInTheDocument();
  });

  it('renders Error Timeline and Agent Error Breakdown sections', async () => {
    mockSuccessfulFetch();
    render(<TroubleshootingPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Error Timeline' })).toBeInTheDocument();
    });

    expect(screen.getByRole('heading', { name: 'Agent Error Breakdown' })).toBeInTheDocument();
  });

  it('shows loading skeletons before data arrives', () => {
    fetchMock.mockImplementation(() => new Promise(() => {}));
    render(<TroubleshootingPage />, { wrapper: createE2EWrapper() });

    expect(screen.getAllByTestId('chart-skeleton')).toHaveLength(1);
    expect(screen.getAllByTestId('table-row-skeleton').length).toBeGreaterThan(0);
  });

  it('shows error state when the API fails', async () => {
    fetchMock.mockImplementation(() => Promise.resolve(errorResponse()));
    render(<TroubleshootingPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });
  });

  it('shows empty state when there are no errors or retries', async () => {
    const emptyData: TroubleshootingResponse = {
      errorTimeline: [],
      agentErrors: [],
      totalErrors: 0,
      totalRetries: 0,
    };
    fetchMock.mockImplementation((url: string) => {
      if (url.includes('/api/analytics/troubleshooting')) return Promise.resolve(jsonResponse(emptyData));
      return Promise.resolve(errorResponse(404));
    });

    render(<TroubleshootingPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
  });

  it('calls the troubleshooting API endpoint', async () => {
    mockSuccessfulFetch();
    render(<TroubleshootingPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByText('CodeReviewer')).toBeInTheDocument();
    });

    const calledUrls = fetchMock.mock.calls.map((call: unknown[]) => call[0]);
    expect(calledUrls).toContainEqual(expect.stringContaining('/api/analytics/troubleshooting'));
  });
});
