import React from 'react';
import { render, screen } from '@testing-library/react';
import type { DailyRunsTrend } from '@/lib/types';

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

import { RunsTrendChart } from '@/components/charts/runs-trend-chart';

const mockData: DailyRunsTrend[] = [
  { date: '2026-02-01', total: 20, success: 15, error: 3, retry: 2 },
  { date: '2026-02-02', total: 25, success: 20, error: 2, retry: 3 },
];

describe('RunsTrendChart', () => {
  it('renders without crashing', () => {
    render(<RunsTrendChart data={mockData} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders an AreaChart', () => {
    render(<RunsTrendChart data={mockData} />);
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
  });

  it('renders three Area elements for success, retry, and error', () => {
    render(<RunsTrendChart data={mockData} />);
    const areas = screen.getAllByTestId('area');
    expect(areas).toHaveLength(3);
  });

  it('renders with empty data', () => {
    render(<RunsTrendChart data={[]} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders axes and grid', () => {
    render(<RunsTrendChart data={mockData} />);
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
  });

  it('XAxis tickFormatter strips the year prefix', () => {
    render(<RunsTrendChart data={mockData} />);
    const tickFormatter = capturedProps['x-axis'].tickFormatter as (date: string) => string;
    expect(tickFormatter('2026-02-01')).toBe('02-01');
    expect(tickFormatter('2026-12-25')).toBe('12-25');
  });
});
