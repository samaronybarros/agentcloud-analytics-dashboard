import React from 'react';
import { render, screen } from '@testing-library/react';
import type { DailyCostTrend } from '@/lib/types';

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

  it('XAxis tickFormatter strips the year prefix', () => {
    render(<CostTrendChart data={mockData} />);
    const tickFormatter = capturedProps['x-axis'].tickFormatter as (date: string) => string;
    expect(tickFormatter('2026-02-01')).toBe('02-01');
    expect(tickFormatter('2026-12-25')).toBe('12-25');
  });

  it('YAxis tickFormatter prepends dollar sign', () => {
    render(<CostTrendChart data={mockData} />);
    const tickFormatter = capturedProps['y-axis'].tickFormatter as (value: number) => string;
    expect(tickFormatter(100)).toBe('$100');
    expect(tickFormatter(0)).toBe('$0');
  });

  it('Tooltip formatter formats cost to two decimal places', () => {
    render(<CostTrendChart data={mockData} />);
    const formatter = capturedProps['tooltip'].formatter as (value: number) => string;
    expect(formatter(45.2)).toBe('$45.20');
    expect(formatter(100)).toBe('$100.00');
    expect(formatter(0.1)).toBe('$0.10');
  });
});
