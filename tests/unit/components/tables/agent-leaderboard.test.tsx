import React from 'react';
import { render, screen } from '@testing-library/react';
import { AgentLeaderboard } from '@/components/tables/agent-leaderboard';
import type { AgentLeaderboardEntry } from '@/lib/types';

const mockData: AgentLeaderboardEntry[] = [
  {
    agentId: 'agent-01',
    agentName: 'CodeReviewer',
    team: 'Platform',
    totalRuns: 80,
    successRate: 0.925,
    avgLatencyMs: 3200,
    totalCost: 45.5,
  },
  {
    agentId: 'agent-02',
    agentName: 'DataSync',
    team: 'Data',
    totalRuns: 60,
    successRate: 0.65,
    avgLatencyMs: 5100,
    totalCost: 120.0,
  },
];

describe('AgentLeaderboard', () => {
  it('renders table headers', () => {
    render(<AgentLeaderboard data={mockData} />);
    expect(screen.getByText('Agent')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByText('Runs')).toBeInTheDocument();
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Avg Latency')).toBeInTheDocument();
    expect(screen.getByText('Cost')).toBeInTheDocument();
  });

  it('renders one row per agent', () => {
    render(<AgentLeaderboard data={mockData} />);
    expect(screen.getByText('CodeReviewer')).toBeInTheDocument();
    expect(screen.getByText('DataSync')).toBeInTheDocument();
  });

  it('formats success rate as percentage', () => {
    render(<AgentLeaderboard data={mockData} />);
    expect(screen.getByText('92.5%')).toBeInTheDocument();
    expect(screen.getByText('65.0%')).toBeInTheDocument();
  });

  it('applies green color for high success rate', () => {
    render(<AgentLeaderboard data={mockData} />);
    const highSuccess = screen.getByText('92.5%');
    expect(highSuccess.className).toContain('text-green-600');
  });

  it('applies red color for low success rate', () => {
    render(<AgentLeaderboard data={mockData} />);
    const lowSuccess = screen.getByText('65.0%');
    expect(lowSuccess.className).toContain('text-red-600');
  });

  it('formats cost with dollar sign', () => {
    render(<AgentLeaderboard data={mockData} />);
    expect(screen.getByText('$45.50')).toBeInTheDocument();
    expect(screen.getByText('$120.00')).toBeInTheDocument();
  });

  it('renders empty table body with no data', () => {
    render(<AgentLeaderboard data={[]} />);
    expect(screen.getByText('Agent')).toBeInTheDocument();
    const rows = screen.queryAllByRole('row');
    // Only header row
    expect(rows).toHaveLength(1);
  });
});
