import React from 'react';
import { render, screen } from '@testing-library/react';
import { TeamUsageTable } from '@/components/tables/team-usage-table';
import type { TeamUsageEntry } from '@/lib/types';

const mockData: TeamUsageEntry[] = [
  { team: 'Platform', totalRuns: 200, activeAgents: 4, activeUsers: 3, totalCost: 180.5 },
  { team: 'Data', totalRuns: 150, activeAgents: 2, activeUsers: 2, totalCost: 220.0 },
];

describe('TeamUsageTable', () => {
  it('renders table headers', () => {
    render(<TeamUsageTable data={mockData} />);
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByText('Runs')).toBeInTheDocument();
    expect(screen.getByText('Active Agents')).toBeInTheDocument();
    expect(screen.getByText('Active Users')).toBeInTheDocument();
    expect(screen.getByText('Cost')).toBeInTheDocument();
  });

  it('renders one row per team', () => {
    render(<TeamUsageTable data={mockData} />);
    expect(screen.getByText('Platform')).toBeInTheDocument();
    expect(screen.getByText('Data')).toBeInTheDocument();
  });

  it('displays active agents and users counts', () => {
    render(<TeamUsageTable data={mockData} />);
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('formats cost with dollar sign', () => {
    render(<TeamUsageTable data={mockData} />);
    expect(screen.getByText('$180.50')).toBeInTheDocument();
    expect(screen.getByText('$220.00')).toBeInTheDocument();
  });

  it('renders empty table body with no data', () => {
    render(<TeamUsageTable data={[]} />);
    const rows = screen.queryAllByRole('row');
    expect(rows).toHaveLength(1);
  });

  it('renders a single team correctly', () => {
    render(<TeamUsageTable data={[mockData[0]]} />);
    const rows = screen.queryAllByRole('row');
    expect(rows).toHaveLength(2);
    expect(screen.getByText('Platform')).toBeInTheDocument();
  });

  it('renders team with zero cost', () => {
    const zeroCost: TeamUsageEntry[] = [
      { team: 'NewTeam', totalRuns: 5, activeAgents: 1, activeUsers: 1, totalCost: 0 },
    ];
    render(<TeamUsageTable data={zeroCost} />);
    expect(screen.getByText('$0.00')).toBeInTheDocument();
    expect(screen.getByText('NewTeam')).toBeInTheDocument();
  });

  it('renders team with single agent and user', () => {
    const minimal: TeamUsageEntry[] = [
      { team: 'Solo', totalRuns: 1, activeAgents: 1, activeUsers: 1, totalCost: 0.01 },
    ];
    render(<TeamUsageTable data={minimal} />);
    expect(screen.getByText('Solo')).toBeInTheDocument();
    expect(screen.getByText('$0.01')).toBeInTheDocument();
  });
});
