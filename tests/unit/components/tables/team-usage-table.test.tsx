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
});
