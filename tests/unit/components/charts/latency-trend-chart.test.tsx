import React from 'react';
import { render, screen } from '@testing-library/react';
import type { DailyLatencyTrend } from '@/lib/analytics/trends';

jest.mock('recharts', () => {
  const React = require('react');
  const mock = (name: string) =>
    ({ children }: { children?: React.ReactNode }) =>
      React.createElement('div', { 'data-testid': name }, children);
  return {
    ResponsiveContainer: mock('responsive-container'),
    LineChart: mock('line-chart'),
    Line: mock('line'),
    XAxis: mock('x-axis'),
    YAxis: mock('y-axis'),
    CartesianGrid: mock('cartesian-grid'),
    Tooltip: mock('tooltip'),
  };
});

import { LatencyTrendChart } from '@/components/charts/latency-trend-chart';

const mockData: DailyLatencyTrend[] = [
  { date: '2026-02-01', p50: 1200, p95: 4500 },
  { date: '2026-02-02', p50: 1100, p95: 4200 },
];

describe('LatencyTrendChart', () => {
  it('renders without crashing', () => {
    render(<LatencyTrendChart data={mockData} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders with empty data', () => {
    render(<LatencyTrendChart data={[]} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });
});
