/**
 * E2E-style test for the Overview page.
 * Mocks at the fetch level — React Query, hooks, and components run as in production.
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import type { OverviewResponse, TrendsResponse } from '@/lib/types';
import { createE2EWrapper, setupFetchMock, jsonResponse, errorResponse } from './helpers';

// Mock recharts (not a DOM-capable charting lib in jsdom)
jest.mock('recharts', () => {
  const React = require('react');
  const mock = (name: string) =>
    ({ children }: { children?: React.ReactNode }) =>
      React.createElement('div', { 'data-testid': name }, children);
  return {
    ResponsiveContainer: mock('responsive-container'),
    AreaChart: mock('area-chart'),
    LineChart: mock('line-chart'),
    BarChart: mock('bar-chart'),
    Area: mock('area'),
    Line: mock('line'),
    Bar: mock('bar'),
    XAxis: mock('x-axis'),
    YAxis: mock('y-axis'),
    CartesianGrid: mock('cartesian-grid'),
    Tooltip: mock('tooltip'),
  };
});

jest.mock('@/lib/hooks/use-role', () => {
  const actual = jest.requireActual('@/lib/hooks/use-role');
  return {
    ...actual,
    useRole: () => ({ role: 'admin' }),
  };
});

import OverviewPage from '@/app/dashboard/page';

const overviewData: OverviewResponse = {
  totalRuns: 500,
  activeUsers: 8,
  activeAgents: 10,
  successRate: 0.744,
  avgLatencyMs: 4200,
  p95LatencyMs: 9800,
  totalTokens: 1500000,
  estimatedCost: 3250.5,
};

const trendsData: TrendsResponse = {
  runsTrend: [
    { date: '2026-03-01', total: 20, success: 15, error: 3, retry: 2 },
    { date: '2026-03-02', total: 25, success: 20, error: 2, retry: 3 },
  ],
  latencyTrend: [
    { date: '2026-03-01', p50: 1200, p95: 4500 },
    { date: '2026-03-02', p50: 1100, p95: 4200 },
  ],
  costTrend: [
    { date: '2026-03-01', cost: 100 },
    { date: '2026-03-02', cost: 120 },
  ],
  runsByDayOfWeek: [
    { day: 'Mon', runs: 25 }, { day: 'Tue', runs: 20 }, { day: 'Wed', runs: 0 },
    { day: 'Thu', runs: 0 }, { day: 'Fri', runs: 0 }, { day: 'Sat', runs: 0 }, { day: 'Sun', runs: 0 },
  ],
};

const fetchMock = setupFetchMock();

function mockSuccessfulFetches() {
  fetchMock.mockImplementation((url: string) => {
    if (url.includes('/api/analytics/overview')) return Promise.resolve(jsonResponse(overviewData));
    if (url.includes('/api/analytics/trends')) return Promise.resolve(jsonResponse(trendsData));
    return Promise.resolve(errorResponse(404));
  });
}

describe('Overview page (e2e)', () => {
  it('renders KPI cards with data fetched from the API', async () => {
    mockSuccessfulFetches();
    render(<OverviewPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Total Runs')).toBeInTheDocument();
    });

    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('74.4%')).toBeInTheDocument();
    expect(screen.getByText('$3250.50')).toBeInTheDocument();
    expect(screen.getByText('Active Users')).toBeInTheDocument();
    expect(screen.getByText('Active Agents')).toBeInTheDocument();
  });

  it('renders all four trend chart sections', async () => {
    mockSuccessfulFetches();
    render(<OverviewPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Runs Over Time' })).toBeInTheDocument();
    });

    expect(screen.getByRole('heading', { name: 'Runs by Day of Week' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Latency Trend (p50 / p95)' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Cost Trend' })).toBeInTheDocument();
  });

  it('shows loading skeletons before data arrives', () => {
    fetchMock.mockImplementation(() => new Promise(() => {})); // never resolves
    render(<OverviewPage />, { wrapper: createE2EWrapper() });

    expect(screen.getAllByTestId('kpi-skeleton').length).toBe(8);
    expect(screen.getAllByTestId('chart-skeleton').length).toBe(4);
  });

  it('shows error state when the API fails', async () => {
    fetchMock.mockImplementation(() => Promise.resolve(errorResponse()));
    render(<OverviewPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });
  });

  it('shows empty state when totalRuns is zero', async () => {
    const emptyOverview: OverviewResponse = {
      totalRuns: 0, activeUsers: 0, activeAgents: 0, successRate: 0,
      avgLatencyMs: 0, p95LatencyMs: 0, totalTokens: 0, estimatedCost: 0,
    };
    const emptyTrends: TrendsResponse = { runsTrend: [], latencyTrend: [], costTrend: [], runsByDayOfWeek: [] };
    fetchMock.mockImplementation((url: string) => {
      if (url.includes('/api/analytics/overview')) return Promise.resolve(jsonResponse(emptyOverview));
      if (url.includes('/api/analytics/trends')) return Promise.resolve(jsonResponse(emptyTrends));
      return Promise.resolve(errorResponse(404));
    });

    render(<OverviewPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
  });

  it('calls the correct API endpoints', async () => {
    mockSuccessfulFetches();
    render(<OverviewPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Total Runs')).toBeInTheDocument();
    });

    const calledUrls = fetchMock.mock.calls.map((call: unknown[]) => call[0]);
    expect(calledUrls).toContainEqual(expect.stringContaining('/api/analytics/overview'));
    expect(calledUrls).toContainEqual(expect.stringContaining('/api/analytics/trends'));
  });
});
