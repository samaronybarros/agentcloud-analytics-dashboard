import React from 'react';
import { render, screen } from '@testing-library/react';
import type { DailyCostTrend } from '@/lib/analytics/trends';

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

import { CostTrendChart } from '@/components/charts/cost-trend-chart';

const mockData: DailyCostTrend[] = [
  { date: '2026-02-01', cost: 45.2 },
  { date: '2026-02-02', cost: 52.8 },
];

describe('CostTrendChart', () => {
  it('renders without crashing', () => {
    render(<CostTrendChart data={mockData} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders an AreaChart', () => {
    render(<CostTrendChart data={mockData} />);
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
  });

  it('renders one Area element for cost', () => {
    render(<CostTrendChart data={mockData} />);
    const areas = screen.getAllByTestId('area');
    expect(areas).toHaveLength(1);
  });

  it('renders with empty data', () => {
    render(<CostTrendChart data={[]} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders axes and grid', () => {
    render(<CostTrendChart data={mockData} />);
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
  });
});
