/**
 * E2E-style test for the Optimization page.
 * Mocks at the fetch level — full data flow from API to rendered DOM.
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import type { InsightsResponse } from '@/lib/types';
import { createE2EWrapper, setupFetchMock, jsonResponse, errorResponse } from './helpers';

import OptimizationPage from '@/app/dashboard/optimization/page';

const insightsData: InsightsResponse = {
  insights: [
    {
      id: 'insight-1',
      type: 'top-cost-driver',
      severity: 'info',
      title: 'Code Generator is the top cost driver',
      description: 'This agent has accumulated $180.50 in estimated costs.',
      agentId: 'agent-01',
      value: 180.5,
    },
    {
      id: 'insight-2',
      type: 'high-cost-low-success',
      severity: 'critical',
      title: 'Data Pipeline has high cost with low success',
      description: 'Success rate is 52.0% while cost is $220.00.',
      agentId: 'agent-02',
      value: 0.52,
    },
    {
      id: 'insight-3',
      type: 'degraded-latency',
      severity: 'warning',
      title: 'QA Runner has elevated latency',
      description: 'Average latency is 8500ms, above the 75th percentile.',
      agentId: 'agent-03',
      value: 8500,
    },
  ],
};

const fetchMock = setupFetchMock();

function mockSuccessfulFetch() {
  fetchMock.mockImplementation((url: string) => {
    if (url.includes('/api/analytics/insights')) return Promise.resolve(jsonResponse(insightsData));
    return Promise.resolve(errorResponse(404));
  });
}

describe('Optimization page (e2e)', () => {
  it('renders insight cards grouped by severity', async () => {
    mockSuccessfulFetch();
    render(<OptimizationPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Code Generator is the top cost driver')).toBeInTheDocument();
    });

    // Critical section
    expect(screen.getByRole('heading', { name: 'Critical' })).toBeInTheDocument();
    expect(screen.getByText('Data Pipeline has high cost with low success')).toBeInTheDocument();

    // Warning section
    expect(screen.getByRole('heading', { name: 'Warnings' })).toBeInTheDocument();
    expect(screen.getByText('QA Runner has elevated latency')).toBeInTheDocument();

    // Info section
    expect(screen.getByRole('heading', { name: 'Information' })).toBeInTheDocument();
  });

  it('shows loading skeletons before data arrives', () => {
    fetchMock.mockImplementation(() => new Promise(() => {}));
    render(<OptimizationPage />, { wrapper: createE2EWrapper() });

    expect(screen.getByRole('heading', { name: 'Optimization' })).toBeInTheDocument();
  });

  it('shows error state when the API fails', async () => {
    fetchMock.mockImplementation(() => Promise.resolve(errorResponse()));
    render(<OptimizationPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });
  });

  it('shows empty state when no insights are returned', async () => {
    const emptyData: InsightsResponse = { insights: [] };
    fetchMock.mockImplementation((url: string) => {
      if (url.includes('/api/analytics/insights')) return Promise.resolve(jsonResponse(emptyData));
      return Promise.resolve(errorResponse(404));
    });

    render(<OptimizationPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
  });

  it('renders only present severity groups', async () => {
    const infoOnlyData: InsightsResponse = {
      insights: [
        {
          id: 'insight-1',
          type: 'top-cost-driver',
          severity: 'info',
          title: 'Agent X is the top cost driver',
          description: 'Cost details.',
          agentId: 'agent-01',
          value: 50,
        },
      ],
    };
    fetchMock.mockImplementation((url: string) => {
      if (url.includes('/api/analytics/insights')) return Promise.resolve(jsonResponse(infoOnlyData));
      return Promise.resolve(errorResponse(404));
    });

    render(<OptimizationPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Information' })).toBeInTheDocument();
    });

    expect(screen.queryByRole('heading', { name: 'Critical' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Warnings' })).not.toBeInTheDocument();
  });

  it('calls the insights API endpoint', async () => {
    mockSuccessfulFetch();
    render(<OptimizationPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Code Generator is the top cost driver')).toBeInTheDocument();
    });

    const calledUrls = fetchMock.mock.calls.map((call: unknown[]) => call[0]);
    expect(calledUrls).toContainEqual(expect.stringContaining('/api/analytics/insights'));
  });
});
