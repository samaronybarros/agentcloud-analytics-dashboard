import React from 'react';
import { render, screen } from '@testing-library/react';
import type { TeamUsageEntry, CostByModelEntry, TopUserEntry } from '@/lib/types';

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
  };
});

jest.mock('@/lib/hooks/use-analytics', () => ({
  useTeamAnalytics: jest.fn(),
}));

import TeamsPage from '@/app/dashboard/teams/page';
import { useTeamAnalytics } from '@/lib/hooks/use-analytics';

const mockUseTeamAnalytics = useTeamAnalytics as jest.Mock;

const mockData = {
  teamUsage: [
    { team: 'Platform', totalRuns: 200, activeAgents: 4, activeUsers: 3, totalCost: 180.5 },
  ] as TeamUsageEntry[],
  costByModel: [
    { model: 'claude-sonnet-4-20250514' as const, totalCost: 200.0, percentage: 1.0 },
  ] as CostByModelEntry[],
  topUsers: [
    { userId: 'user-01', userName: 'Alice Chen', team: 'Platform', totalRuns: 120, totalCost: 55.0 },
  ] as TopUserEntry[],
};

describe('TeamsPage', () => {
  beforeEach(() => {
    mockUseTeamAnalytics.mockReturnValue({ data: mockData, isLoading: false });
  });

  it('renders the page heading', () => {
    render(<TeamsPage />);
    expect(screen.getByRole('heading', { name: 'Teams' })).toBeInTheDocument();
  });

  it('renders Usage by Team section', () => {
    render(<TeamsPage />);
    expect(screen.getByRole('heading', { name: 'Usage by Team' })).toBeInTheDocument();
    // "Platform" appears in both team table and user table, so use getAllByText
    expect(screen.getAllByText('Platform').length).toBeGreaterThanOrEqual(1);
  });

  it('renders Cost by Model section', () => {
    render(<TeamsPage />);
    expect(screen.getByRole('heading', { name: 'Cost by Model' })).toBeInTheDocument();
  });

  it('renders Top Users section', () => {
    render(<TeamsPage />);
    expect(screen.getByRole('heading', { name: 'Top Users' })).toBeInTheDocument();
    expect(screen.getByText('Alice Chen')).toBeInTheDocument();
  });

  it('shows loading state with skeletons', () => {
    mockUseTeamAnalytics.mockReturnValue({ data: undefined, isLoading: true });
    render(<TeamsPage />);
    expect(screen.getByRole('heading', { name: 'Teams' })).toBeInTheDocument();
    expect(screen.getAllByTestId('table-row-skeleton').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId('chart-skeleton')).toBeInTheDocument();
  });

  it('shows error state when data is null', () => {
    mockUseTeamAnalytics.mockReturnValue({ data: null, isLoading: false });
    render(<TeamsPage />);
    expect(screen.getByRole('heading', { name: 'Teams' })).toBeInTheDocument();
    expect(screen.getByText('Failed to load team data.')).toBeInTheDocument();
  });
});
