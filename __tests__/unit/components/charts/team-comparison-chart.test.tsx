import React from 'react';
import { render, screen } from '@testing-library/react';
import type { TeamUsageEntry } from '@/lib/types';

const capturedProps: Record<string, Record<string, unknown>> = {};

jest.mock('recharts', () => {
  const React = require('react');
  const mock = (name: string) =>
    ({ children, ...props }: { children?: React.ReactNode }) => {
      capturedProps[name] = props;
      return React.createElement('div', { 'data-testid': name }, children);
    };
  return {
    ResponsiveContainer: mock('responsive-container'),
    BarChart: mock('bar-chart'),
    Bar: mock('bar'),
    XAxis: mock('x-axis'),
    YAxis: mock('y-axis'),
    CartesianGrid: mock('cartesian-grid'),
    Tooltip: mock('tooltip'),
    Legend: mock('legend'),
  };
});

import { TeamComparisonChart } from '@/components/charts/team-comparison-chart';

const mockData: TeamUsageEntry[] = [
  { team: 'Platform', totalRuns: 200, activeAgents: 4, activeUsers: 3, totalCost: 180.5, successRate: 0.85, avgLatencyMs: 2400 },
  { team: 'Data', totalRuns: 150, activeAgents: 2, activeUsers: 2, totalCost: 220.0, successRate: 0.72, avgLatencyMs: 3600 },
  { team: 'Backend', totalRuns: 100, activeAgents: 3, activeUsers: 2, totalCost: 95.0, successRate: 0.91, avgLatencyMs: 1800 },
];

describe('TeamComparisonChart', () => {
  beforeEach(() => {
    Object.keys(capturedProps).forEach((key) => delete capturedProps[key]);
  });

  it('renders without crashing', () => {
    render(<TeamComparisonChart data={mockData} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders a BarChart', () => {
    render(<TeamComparisonChart data={mockData} />);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('renders XAxis with team names', () => {
    render(<TeamComparisonChart data={mockData} />);
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(capturedProps['x-axis'].dataKey).toBe('team');
  });

  it('renders bars for success rate and cost', () => {
    render(<TeamComparisonChart data={mockData} />);
    const bars = screen.getAllByTestId('bar');
    expect(bars.length).toBeGreaterThanOrEqual(2);
  });

  it('renders a Legend', () => {
    render(<TeamComparisonChart data={mockData} />);
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('renders with empty data', () => {
    render(<TeamComparisonChart data={[]} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders with a single team', () => {
    render(<TeamComparisonChart data={[mockData[0]]} />);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });
});
