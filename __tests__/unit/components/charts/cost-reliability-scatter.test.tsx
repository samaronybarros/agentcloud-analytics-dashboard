import React from 'react';
import { render, screen } from '@testing-library/react';
import type { AgentLeaderboardEntry } from '@/lib/types';

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
    ScatterChart: mock('scatter-chart'),
    Scatter: mock('scatter'),
    XAxis: mock('x-axis'),
    YAxis: mock('y-axis'),
    ZAxis: mock('z-axis'),
    CartesianGrid: mock('cartesian-grid'),
    Tooltip: mock('tooltip'),
    Cell: mock('cell'),
    ReferenceLine: mock('reference-line'),
  };
});

import { CostReliabilityScatter } from '@/components/charts/cost-reliability-scatter';

const mockData: AgentLeaderboardEntry[] = [
  {
    agentId: 'agent-01',
    agentName: 'Code Generator',
    team: 'Platform',
    totalRuns: 120,
    successRate: 0.92,
    avgLatencyMs: 2400,
    totalCost: 180.5,
  },
  {
    agentId: 'agent-02',
    agentName: 'Data Pipeline',
    team: 'Data',
    totalRuns: 80,
    successRate: 0.65,
    avgLatencyMs: 5600,
    totalCost: 220.0,
  },
  {
    agentId: 'agent-03',
    agentName: 'QA Runner',
    team: 'Backend',
    totalRuns: 50,
    successRate: 0.88,
    avgLatencyMs: 1200,
    totalCost: 45.0,
  },
];

describe('CostReliabilityScatter', () => {
  beforeEach(() => {
    Object.keys(capturedProps).forEach((key) => delete capturedProps[key]);
  });

  it('renders without crashing', () => {
    render(<CostReliabilityScatter data={mockData} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders a ScatterChart', () => {
    render(<CostReliabilityScatter data={mockData} />);
    expect(screen.getByTestId('scatter-chart')).toBeInTheDocument();
  });

  it('renders XAxis for cost', () => {
    render(<CostReliabilityScatter data={mockData} />);
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(capturedProps['x-axis'].dataKey).toBe('totalCost');
  });

  it('renders YAxis for success rate', () => {
    render(<CostReliabilityScatter data={mockData} />);
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(capturedProps['y-axis'].dataKey).toBe('successRate');
  });

  it('renders a Scatter element with the data', () => {
    render(<CostReliabilityScatter data={mockData} />);
    expect(screen.getByTestId('scatter')).toBeInTheDocument();
    expect(capturedProps['scatter'].data).toEqual(mockData);
  });

  it('renders one Cell per agent', () => {
    render(<CostReliabilityScatter data={mockData} />);
    const cells = screen.getAllByTestId('cell');
    expect(cells).toHaveLength(3);
  });

  it('renders reference lines for thresholds', () => {
    render(<CostReliabilityScatter data={mockData} />);
    const refLines = screen.getAllByTestId('reference-line');
    expect(refLines.length).toBeGreaterThanOrEqual(1);
  });

  it('renders with empty data', () => {
    render(<CostReliabilityScatter data={[]} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders with a single agent', () => {
    render(<CostReliabilityScatter data={[mockData[0]]} />);
    const cells = screen.getAllByTestId('cell');
    expect(cells).toHaveLength(1);
  });

  it('uses ZAxis for run volume (bubble size)', () => {
    render(<CostReliabilityScatter data={mockData} />);
    expect(screen.getByTestId('z-axis')).toBeInTheDocument();
    expect(capturedProps['z-axis'].dataKey).toBe('totalRuns');
  });
});
