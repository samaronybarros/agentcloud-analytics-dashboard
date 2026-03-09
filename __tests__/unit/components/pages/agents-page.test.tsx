import React from 'react';
import { render, screen } from '@testing-library/react';
import type { AgentLeaderboardEntry, FailureTaxonomyEntry } from '@/lib/types';

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

jest.mock('@/lib/hooks/use-analytics', () => ({
  useAgentAnalytics: jest.fn(),
}));

jest.mock('@/lib/hooks/use-date-range', () => ({
  useDateRange: () => ({ range: {}, preset: 'all', setPreset: jest.fn() }),
}));

import AgentsPage from '@/app/dashboard/agents/page';
import { useAgentAnalytics } from '@/lib/hooks/use-analytics';

const mockUseAgentAnalytics = useAgentAnalytics as jest.Mock;

const mockData = {
  leaderboard: [
    {
      agentId: 'agent-01', agentName: 'CodeReviewer', team: 'Platform',
      totalRuns: 80, successRate: 0.925, avgLatencyMs: 3200, totalCost: 45.5,
    },
  ] as AgentLeaderboardEntry[],
  failureTaxonomy: [
    { errorType: 'timeout', count: 30, percentage: 0.6 },
  ] as FailureTaxonomyEntry[],
};

describe('AgentsPage', () => {
  beforeEach(() => {
    mockUseAgentAnalytics.mockReturnValue({ data: mockData, isLoading: false });
  });

  it('renders the page heading', () => {
    render(<AgentsPage />);
    expect(screen.getByRole('heading', { name: 'Agents' })).toBeInTheDocument();
  });

  it('renders Agent Leaderboard section', () => {
    render(<AgentsPage />);
    expect(screen.getByRole('heading', { name: 'Agent Leaderboard' })).toBeInTheDocument();
    expect(screen.getByText('CodeReviewer')).toBeInTheDocument();
  });

  it('renders Failure Taxonomy section', () => {
    render(<AgentsPage />);
    expect(screen.getByRole('heading', { name: 'Failure Taxonomy' })).toBeInTheDocument();
  });

  it('shows empty state when leaderboard is empty', () => {
    mockUseAgentAnalytics.mockReturnValue({
      data: { leaderboard: [], failureTaxonomy: [] },
      isLoading: false,
    });
    render(<AgentsPage />);
    expect(screen.getByRole('heading', { name: 'Agents' })).toBeInTheDocument();
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('shows loading state with skeletons', () => {
    mockUseAgentAnalytics.mockReturnValue({ data: undefined, isLoading: true });
    render(<AgentsPage />);
    expect(screen.getByRole('heading', { name: 'Agents' })).toBeInTheDocument();
    expect(screen.getAllByTestId('table-row-skeleton').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId('chart-skeleton')).toBeInTheDocument();
  });

  it('shows error state when query fails', () => {
    mockUseAgentAnalytics.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Failed to fetch agents'),
    });
    render(<AgentsPage />);
    expect(screen.getByRole('heading', { name: 'Agents' })).toBeInTheDocument();
    expect(screen.getByTestId('error-state')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch agents')).toBeInTheDocument();
  });
});
