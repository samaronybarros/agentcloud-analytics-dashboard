import React from 'react';
import { render, screen } from '@testing-library/react';
import type { DailyRunsTrend } from '@/lib/analytics/trends';

jest.mock('recharts', () => {
  const React = require('react');
  const mock = (name: string) =>
    ({ children, ...props }: { children?: React.ReactNode }) =>
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

  it('renders with empty data', () => {
    render(<RunsTrendChart data={[]} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });
});
