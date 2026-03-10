import React from 'react';
import { render, screen } from '@testing-library/react';

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

jest.mock('@/lib/hooks/use-analytics', () => ({
  useTroubleshooting: jest.fn(),
}));

jest.mock('@/lib/hooks/use-date-range', () => ({
  useDateRange: () => ({ range: {}, preset: 'all', setPreset: jest.fn() }),
}));

import TroubleshootingPage from '@/app/dashboard/troubleshooting/page';
import { useTroubleshooting } from '@/lib/hooks/use-analytics';

const mockUseTroubleshooting = useTroubleshooting as jest.Mock;

const mockData = {
  errorTimeline: [{ date: '2026-03-01', errors: 5, retries: 3 }],
  agentErrors: [{
    agentId: 'agent-01', agentName: 'CodeReviewer', team: 'Platform',
    totalErrors: 8, errorsByType: { timeout: 5, 'rate-limit': 3 }, topErrorType: 'timeout',
    remediation: 'Consider increasing timeout limits.',
  }],
  totalErrors: 8,
  totalRetries: 3,
};

describe('TroubleshootingPage', () => {
  beforeEach(() => {
    mockUseTroubleshooting.mockReturnValue({ data: mockData, isLoading: false });
  });

  it('renders the page heading', () => {
    render(<TroubleshootingPage />);
    expect(screen.getByRole('heading', { name: 'Troubleshooting' })).toBeInTheDocument();
  });

  it('renders Error Timeline section', () => {
    render(<TroubleshootingPage />);
    expect(screen.getByRole('heading', { name: 'Error Timeline' })).toBeInTheDocument();
  });

  it('renders Agent Error Breakdown section', () => {
    render(<TroubleshootingPage />);
    expect(screen.getByRole('heading', { name: 'Agent Error Breakdown' })).toBeInTheDocument();
  });

  it('shows summary stats with totalErrors and totalRetries', () => {
    render(<TroubleshootingPage />);
    expect(screen.getByTestId('total-errors')).toHaveTextContent('8');
    expect(screen.getByTestId('total-retries')).toHaveTextContent('3');
  });

  it('shows loading state with skeletons', () => {
    mockUseTroubleshooting.mockReturnValue({ data: undefined, isLoading: true });
    render(<TroubleshootingPage />);
    expect(screen.getByRole('heading', { name: 'Troubleshooting' })).toBeInTheDocument();
    expect(screen.getAllByTestId('chart-skeleton')).toHaveLength(1);
    expect(screen.getAllByTestId('table-row-skeleton').length).toBeGreaterThanOrEqual(1);
  });

  it('shows error state when query fails', () => {
    mockUseTroubleshooting.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Failed to fetch troubleshooting'),
    });
    render(<TroubleshootingPage />);
    expect(screen.getByRole('heading', { name: 'Troubleshooting' })).toBeInTheDocument();
    expect(screen.getByTestId('error-state')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch troubleshooting')).toBeInTheDocument();
  });

  it('shows empty state when totalErrors and totalRetries are both 0', () => {
    mockUseTroubleshooting.mockReturnValue({
      data: { errorTimeline: [], agentErrors: [], totalErrors: 0, totalRetries: 0 },
      isLoading: false,
    });
    render(<TroubleshootingPage />);
    expect(screen.getByRole('heading', { name: 'Troubleshooting' })).toBeInTheDocument();
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });
});
