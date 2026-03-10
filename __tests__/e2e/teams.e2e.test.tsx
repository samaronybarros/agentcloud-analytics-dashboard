/**
 * E2E-style test for the Teams page.
 * Mocks at the fetch level — full data flow from API to rendered DOM.
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import type { TeamsResponse } from '@/lib/types';
import { createE2EWrapper, setupFetchMock, jsonResponse, errorResponse } from './helpers';

jest.mock('recharts', () => {
  const React = require('react');
  const mock = (name: string) =>
    ({ children }: { children?: React.ReactNode }) =>
      React.createElement('div', { 'data-testid': name }, children);
  return {
    ResponsiveContainer: mock('responsive-container'),
    PieChart: mock('pie-chart'),
    Pie: mock('pie'),
    Cell: mock('cell'),
    Tooltip: mock('tooltip'),
    Legend: mock('legend'),
    BarChart: mock('bar-chart'),
    Bar: mock('bar'),
    XAxis: mock('x-axis'),
    YAxis: mock('y-axis'),
    CartesianGrid: mock('cartesian-grid'),
  };
});

import TeamsPage from '@/app/dashboard/teams/page';

const teamsData: TeamsResponse = {
  teamUsage: [
    { team: 'Platform', totalRuns: 200, activeAgents: 4, activeUsers: 5, totalCost: 450.0, successRate: 0.88, avgLatencyMs: 2100 },
    { team: 'Data', totalRuns: 150, activeAgents: 3, activeUsers: 3, totalCost: 320.0, successRate: 0.76, avgLatencyMs: 3400 },
  ],
  costByModel: [
    { model: 'claude-sonnet-4-20250514', totalCost: 400, percentage: 0.52 },
    { model: 'gpt-4o', totalCost: 370, percentage: 0.48 },
  ],
  topUsers: [
    { userId: 'user-01', userName: 'Alice Chen', team: 'Platform', totalRuns: 75, totalCost: 120.0 },
    { userId: 'user-02', userName: 'Bob Kim', team: 'Data', totalRuns: 60, totalCost: 95.0 },
  ],
};

const fetchMock = setupFetchMock();

function mockSuccessfulFetch() {
  fetchMock.mockImplementation((url: string) => {
    if (url.includes('/api/analytics/teams')) return Promise.resolve(jsonResponse(teamsData));
    return Promise.resolve(errorResponse(404));
  });
}

describe('Teams page (e2e)', () => {
  it('renders team usage table with data from the API', async () => {
    mockSuccessfulFetch();
    render(<TeamsPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      // "Platform" appears in both team-usage and top-users tables
      expect(screen.getAllByText('Platform').length).toBeGreaterThanOrEqual(1);
    });

    expect(screen.getAllByText('Data').length).toBeGreaterThanOrEqual(1);
  });

  it('renders all four sections', async () => {
    mockSuccessfulFetch();
    render(<TeamsPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Usage by Team' })).toBeInTheDocument();
    });

    expect(screen.getByRole('heading', { name: 'Team Comparison' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Cost by Model' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Top Users' })).toBeInTheDocument();
  });

  it('renders top users with names', async () => {
    mockSuccessfulFetch();
    render(<TeamsPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Alice Chen')).toBeInTheDocument();
    });

    expect(screen.getByText('Bob Kim')).toBeInTheDocument();
  });

  it('calls the teams API endpoint', async () => {
    mockSuccessfulFetch();
    render(<TeamsPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getAllByText('Platform').length).toBeGreaterThanOrEqual(1);
    });

    const calledUrls = fetchMock.mock.calls.map((call: unknown[]) => call[0]);
    expect(calledUrls).toContainEqual(expect.stringContaining('/api/analytics/teams'));
  });

  it('shows loading skeletons before data arrives', () => {
    fetchMock.mockImplementation(() => new Promise(() => {}));
    render(<TeamsPage />, { wrapper: createE2EWrapper() });

    expect(screen.getAllByTestId('table-row-skeleton').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('chart-skeleton')).toHaveLength(2);
  });

  it('shows error state when the API fails', async () => {
    fetchMock.mockImplementation(() => Promise.resolve(errorResponse()));
    render(<TeamsPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });
  });

  it('shows empty state when teamUsage is empty', async () => {
    const emptyData: TeamsResponse = { teamUsage: [], costByModel: [], topUsers: [] };
    fetchMock.mockImplementation((url: string) => {
      if (url.includes('/api/analytics/teams')) return Promise.resolve(jsonResponse(emptyData));
      return Promise.resolve(errorResponse(404));
    });

    render(<TeamsPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
  });

});
