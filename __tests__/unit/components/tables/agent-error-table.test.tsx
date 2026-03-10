import React from 'react';
import { render, screen } from '@testing-library/react';
import { AgentErrorTable } from '@/components/tables/agent-error-table';
import type { AgentErrorBreakdown } from '@/lib/types';

const mockData: AgentErrorBreakdown[] = [
  {
    agentId: 'agent-01',
    agentName: 'CodeReviewer',
    team: 'Platform',
    totalErrors: 12,
    errorsByType: { timeout: 8, 'rate-limit': 4 },
    topErrorType: 'timeout',
    remediation: 'Consider increasing timeout limits for long-running reviews.',
  },
  {
    agentId: 'agent-02',
    agentName: 'DataSync',
    team: 'Data',
    totalErrors: 6,
    errorsByType: { 'rate-limit': 4, 'auth-failure': 2 },
    topErrorType: 'rate-limit',
    remediation: 'Implement exponential backoff for API calls.',
  },
];

describe('AgentErrorTable', () => {
  it('renders table headers', () => {
    render(<AgentErrorTable data={mockData} />);
    expect(screen.getByText('Agent')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByText('Errors')).toBeInTheDocument();
    expect(screen.getByText('Top Error')).toBeInTheDocument();
    expect(screen.getByText('Remediation')).toBeInTheDocument();
  });

  it('renders one row per agent', () => {
    render(<AgentErrorTable data={mockData} />);
    expect(screen.getByText('CodeReviewer')).toBeInTheDocument();
    expect(screen.getByText('DataSync')).toBeInTheDocument();
  });

  it('displays error counts', () => {
    render(<AgentErrorTable data={mockData} />);
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('applies red color for error count >= 10', () => {
    render(<AgentErrorTable data={mockData} />);
    const highErrors = screen.getByText('12');
    expect(highErrors.className).toContain('text-red-600');
  });

  it('applies amber color for error count >= 5 and < 10', () => {
    render(<AgentErrorTable data={mockData} />);
    const mediumErrors = screen.getByText('6');
    expect(mediumErrors.className).toContain('text-amber-600');
  });

  it('shows top error type', () => {
    render(<AgentErrorTable data={mockData} />);
    expect(screen.getByText('timeout')).toBeInTheDocument();
    expect(screen.getByText('rate-limit')).toBeInTheDocument();
  });

  it('shows remediation text', () => {
    render(<AgentErrorTable data={mockData} />);
    expect(screen.getByText('Consider increasing timeout limits for long-running reviews.')).toBeInTheDocument();
    expect(screen.getByText('Implement exponential backoff for API calls.')).toBeInTheDocument();
  });

  it('renders empty table body with no data', () => {
    render(<AgentErrorTable data={[]} />);
    expect(screen.getByText('Agent')).toBeInTheDocument();
    const rows = screen.queryAllByRole('row');
    expect(rows).toHaveLength(1);
  });
});
