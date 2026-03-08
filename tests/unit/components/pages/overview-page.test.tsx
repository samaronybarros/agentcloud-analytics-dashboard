import React from 'react';
import { render, screen } from '@testing-library/react';
import type { OverviewKPIs } from '@/lib/types';
import type { DailyRunsTrend, DailyLatencyTrend, DailyCostTrend } from '@/lib/analytics/trends';

const mockKPIs: OverviewKPIs = {
  totalRuns: 500,
  activeUsers: 8,
  activeAgents: 10,
  successRate: 0.744,
  avgLatencyMs: 4200,
  p95LatencyMs: 9800,
  totalTokens: 1500000,
  estimatedCost: 3250.5,
};

const mockTrends = {
  runsTrend: [{ date: '2026-03-01', total: 20, success: 15, error: 3, retry: 2 }] as DailyRunsTrend[],
  latencyTrend: [{ date: '2026-03-01', p50: 1200, p95: 4500 }] as DailyLatencyTrend[],
  costTrend: [{ date: '2026-03-01', cost: 100 }] as DailyCostTrend[],
};

// Mock recharts before importing page
jest.mock('recharts', () => {
  const React = require('react');
  const mock = (name: string) =>
    ({ children }: { children?: React.ReactNode }) =>
      React.createElement('div', { 'data-testid': name }, children);
  return {
    ResponsiveContainer: mock('responsive-container'),
    AreaChart: mock('area-chart'),
    LineChart: mock('line-chart'),
    Area: mock('area'),
    Line: mock('line'),
    XAxis: mock('x-axis'),
    YAxis: mock('y-axis'),
    CartesianGrid: mock('cartesian-grid'),
    Tooltip: mock('tooltip'),
  };
});

jest.mock('@/lib/hooks/use-analytics', () => ({
  useOverviewKPIs: jest.fn(),
  useTrends: jest.fn(),
}));

jest.mock('@/lib/hooks/use-date-range', () => ({
  useDateRange: () => ({ range: {}, preset: 'all', setPreset: jest.fn() }),
}));

import OverviewPage from '@/app/dashboard/page';
import { useOverviewKPIs, useTrends } from '@/lib/hooks/use-analytics';

const mockUseOverviewKPIs = useOverviewKPIs as jest.Mock;
const mockUseTrends = useTrends as jest.Mock;

describe('OverviewPage', () => {
  beforeEach(() => {
    mockUseOverviewKPIs.mockReturnValue({ data: mockKPIs, isLoading: false });
    mockUseTrends.mockReturnValue({ data: mockTrends, isLoading: false });
  });

  it('renders the page heading', () => {
    render(<OverviewPage />);
    expect(screen.getByRole('heading', { name: 'Overview' })).toBeInTheDocument();
  });

  it('renders all 8 KPI cards', () => {
    render(<OverviewPage />);
    expect(screen.getByText('Total Runs')).toBeInTheDocument();
    expect(screen.getByText('Active Users')).toBeInTheDocument();
    expect(screen.getByText('Active Agents')).toBeInTheDocument();
    expect(screen.getByText('Success Rate')).toBeInTheDocument();
    expect(screen.getByText('Avg Latency')).toBeInTheDocument();
    expect(screen.getByText('p95 Latency')).toBeInTheDocument();
    expect(screen.getByText('Token Volume')).toBeInTheDocument();
    expect(screen.getByText('Estimated Cost')).toBeInTheDocument();
  });

  it('renders formatted KPI values', () => {
    render(<OverviewPage />);
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('74.4%')).toBeInTheDocument();
    expect(screen.getByText('$3250.50')).toBeInTheDocument();
  });

  it('renders trend chart sections', () => {
    render(<OverviewPage />);
    expect(screen.getByRole('heading', { name: 'Runs Over Time' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Latency Trend (p50 / p95)' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Cost Trend' })).toBeInTheDocument();
  });

  it('shows loading state with skeletons', () => {
    mockUseOverviewKPIs.mockReturnValue({ data: undefined, isLoading: true });
    mockUseTrends.mockReturnValue({ data: undefined, isLoading: true });
    render(<OverviewPage />);
    expect(screen.getByRole('heading', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getAllByTestId('kpi-skeleton').length).toBe(8);
    expect(screen.getAllByTestId('chart-skeleton').length).toBe(3);
  });

  it('shows empty state when totalRuns is zero', () => {
    const emptyKPIs: OverviewKPIs = {
      totalRuns: 0, activeUsers: 0, activeAgents: 0, successRate: 0,
      avgLatencyMs: 0, p95LatencyMs: 0, totalTokens: 0, estimatedCost: 0,
    };
    const emptyTrends = { runsTrend: [], latencyTrend: [], costTrend: [] };
    mockUseOverviewKPIs.mockReturnValue({ data: emptyKPIs, isLoading: false });
    mockUseTrends.mockReturnValue({ data: emptyTrends, isLoading: false });
    render(<OverviewPage />);
    expect(screen.getByRole('heading', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('No data available for the selected time period.')).toBeInTheDocument();
  });

  it('shows error state when data is null', () => {
    mockUseOverviewKPIs.mockReturnValue({ data: null, isLoading: false });
    mockUseTrends.mockReturnValue({ data: null, isLoading: false });
    render(<OverviewPage />);
    expect(screen.getByRole('heading', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByText('Failed to load analytics data.')).toBeInTheDocument();
  });
});
