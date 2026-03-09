/**
 * E2E-style test for the Agents page.
 * Mocks at the fetch level — full data flow from API to rendered DOM.
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import type { AgentsResponse } from '@/lib/types';
import { createE2EWrapper, setupFetchMock, jsonResponse, errorResponse } from './helpers';

jest.mock('recharts', () => {
  const React = require('react');
  const mock = (name: string) =>
    ({ children }: { children?: React.ReactNode }) =>
      React.createElement('div', { 'data-testid': name }, children);
  return {
    ResponsiveContainer: mock('responsive-container'),
    BarChart: mock('bar-chart'),
    Bar: mock('bar'),
    XAxis: mock('x-axis'),
    YAxis: mock('y-axis'),
    CartesianGrid: mock('cartesian-grid'),
    Tooltip: mock('tooltip'),
  };
});

import AgentsPage from '@/app/dashboard/agents/page';

const agentsData: AgentsResponse = {
  leaderboard: [
    {
      agentId: 'agent-01',
      agentName: 'Code Generator',
      team: 'Platform',
      totalRuns: 120,
      successRate: 0.85,
      avgLatencyMs: 2400,
      totalCost: 180.5,
    },
    {
      agentId: 'agent-02',
      agentName: 'Data Pipeline',
      team: 'Data',
      totalRuns: 80,
      successRate: 0.72,
      avgLatencyMs: 5600,
      totalCost: 220.0,
    },
  ],
  failureTaxonomy: [
    { errorType: 'timeout', count: 15, percentage: 0.5 },
    { errorType: 'rate-limit', count: 10, percentage: 0.33 },
    { errorType: 'auth-failure', count: 5, percentage: 0.17 },
  ],
};

const fetchMock = setupFetchMock();

function mockSuccessfulFetch() {
  fetchMock.mockImplementation((url: string) => {
    if (url.includes('/api/analytics/agents')) return Promise.resolve(jsonResponse(agentsData));
    return Promise.resolve(errorResponse(404));
  });
}

describe('Agents page (e2e)', () => {
  it('renders the agent leaderboard with data from the API', async () => {
    mockSuccessfulFetch();
    render(<AgentsPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Code Generator')).toBeInTheDocument();
    });

    expect(screen.getByText('Data Pipeline')).toBeInTheDocument();
    expect(screen.getByText('Platform')).toBeInTheDocument();
    expect(screen.getByText('Data')).toBeInTheDocument();
  });

  it('renders the failure taxonomy chart section', async () => {
    mockSuccessfulFetch();
    render(<AgentsPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Failure Taxonomy' })).toBeInTheDocument();
    });
  });

  it('renders both the leaderboard and chart sections', async () => {
    mockSuccessfulFetch();
    render(<AgentsPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Agent Leaderboard' })).toBeInTheDocument();
    });

    expect(screen.getByRole('heading', { name: 'Failure Taxonomy' })).toBeInTheDocument();
  });

  it('shows loading skeletons before data arrives', () => {
    fetchMock.mockImplementation(() => new Promise(() => {}));
    render(<AgentsPage />, { wrapper: createE2EWrapper() });

    expect(screen.getAllByTestId('table-row-skeleton').length).toBeGreaterThan(0);
    expect(screen.getByTestId('chart-skeleton')).toBeInTheDocument();
  });

  it('shows error state when the API fails', async () => {
    fetchMock.mockImplementation(() => Promise.resolve(errorResponse()));
    render(<AgentsPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });
  });

  it('shows empty state when leaderboard is empty', async () => {
    const emptyData: AgentsResponse = { leaderboard: [], failureTaxonomy: [] };
    fetchMock.mockImplementation((url: string) => {
      if (url.includes('/api/analytics/agents')) return Promise.resolve(jsonResponse(emptyData));
      return Promise.resolve(errorResponse(404));
    });

    render(<AgentsPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
  });

  it('calls the agents API endpoint', async () => {
    mockSuccessfulFetch();
    render(<AgentsPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Code Generator')).toBeInTheDocument();
    });

    const calledUrls = fetchMock.mock.calls.map((call: unknown[]) => call[0]);
    expect(calledUrls).toContainEqual(expect.stringContaining('/api/analytics/agents'));
  });
});
