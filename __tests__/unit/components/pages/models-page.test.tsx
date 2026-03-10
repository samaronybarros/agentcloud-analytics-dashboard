import React from 'react';
import { render, screen } from '@testing-library/react';
import type { ModelPerformanceEntry } from '@/lib/types';

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

jest.mock('@/lib/hooks/use-analytics', () => ({
  useModelAnalytics: jest.fn(),
}));

jest.mock('@/lib/hooks/use-date-range', () => ({
  useDateRange: () => ({ range: {}, preset: 'all', setPreset: jest.fn() }),
}));

jest.mock('@/lib/hooks/use-role', () => ({
  useRole: () => ({ role: 'admin', setRole: jest.fn() }),
}));

import ModelsPage from '@/app/dashboard/models/page';
import { useModelAnalytics } from '@/lib/hooks/use-analytics';

const mockUseModelAnalytics = useModelAnalytics as jest.Mock;

const mockData = {
  models: [
    { model: 'claude-sonnet-4-20250514' as const, totalRuns: 200, successRate: 0.88, avgLatencyMs: 2400, totalCost: 180.5, costPerThousandTokens: 0.0032, totalTokens: 56000 },
  ] as ModelPerformanceEntry[],
};

describe('ModelsPage', () => {
  beforeEach(() => {
    mockUseModelAnalytics.mockReturnValue({ data: mockData, isLoading: false });
  });

  it('renders the page heading', () => {
    render(<ModelsPage />);
    expect(screen.getByRole('heading', { name: 'Models' })).toBeInTheDocument();
  });

  it('renders Model Performance section', () => {
    render(<ModelsPage />);
    expect(screen.getByRole('heading', { name: 'Model Performance' })).toBeInTheDocument();
    expect(screen.getByText('claude-sonnet-4-20250514')).toBeInTheDocument();
  });

  it('shows empty state when models is empty', () => {
    mockUseModelAnalytics.mockReturnValue({
      data: { models: [] },
      isLoading: false,
    });
    render(<ModelsPage />);
    expect(screen.getByRole('heading', { name: 'Models' })).toBeInTheDocument();
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('shows loading state with skeletons', () => {
    mockUseModelAnalytics.mockReturnValue({ data: undefined, isLoading: true });
    render(<ModelsPage />);
    expect(screen.getByRole('heading', { name: 'Models' })).toBeInTheDocument();
    expect(screen.getAllByTestId('table-row-skeleton').length).toBeGreaterThanOrEqual(1);
  });

  it('shows error state when query fails', () => {
    mockUseModelAnalytics.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Failed to fetch model data'),
    });
    render(<ModelsPage />);
    expect(screen.getByRole('heading', { name: 'Models' })).toBeInTheDocument();
    expect(screen.getByTestId('error-state')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch model data')).toBeInTheDocument();
  });
});
