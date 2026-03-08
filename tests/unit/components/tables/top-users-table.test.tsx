import React from 'react';
import { render, screen } from '@testing-library/react';
import { TopUsersTable } from '@/components/tables/top-users-table';
import type { TopUserEntry } from '@/lib/types';

const mockData: TopUserEntry[] = [
  { userId: 'user-01', userName: 'Alice Chen', team: 'Platform', totalRuns: 120, totalCost: 55.0 },
  { userId: 'user-02', userName: 'Bob Martinez', team: 'Platform', totalRuns: 95, totalCost: 40.25 },
];

describe('TopUsersTable', () => {
  it('renders table headers', () => {
    render(<TopUsersTable data={mockData} />);
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByText('Runs')).toBeInTheDocument();
    expect(screen.getByText('Cost')).toBeInTheDocument();
  });

  it('renders one row per user', () => {
    render(<TopUsersTable data={mockData} />);
    expect(screen.getByText('Alice Chen')).toBeInTheDocument();
    expect(screen.getByText('Bob Martinez')).toBeInTheDocument();
  });

  it('formats cost with dollar sign', () => {
    render(<TopUsersTable data={mockData} />);
    expect(screen.getByText('$55.00')).toBeInTheDocument();
    expect(screen.getByText('$40.25')).toBeInTheDocument();
  });

  it('renders empty table body with no data', () => {
    render(<TopUsersTable data={[]} />);
    const rows = screen.queryAllByRole('row');
    expect(rows).toHaveLength(1);
  });
});
