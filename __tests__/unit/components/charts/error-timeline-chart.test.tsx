import React from 'react';
import { render, screen } from '@testing-library/react';
import type { ErrorTimelineEntry } from '@/lib/types';

let capturedProps: Record<string, unknown> = {};

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

import { ErrorTimelineChart } from '@/components/charts/error-timeline-chart';

const mockData: ErrorTimelineEntry[] = [
  { date: '2026-03-01', errors: 5, retries: 3 },
  { date: '2026-03-02', errors: 8, retries: 2 },
  { date: '2026-03-03', errors: 3, retries: 6 },
];

describe('ErrorTimelineChart', () => {
  beforeEach(() => {
    capturedProps = {};
  });

  it('renders without crashing', () => {
    render(<ErrorTimelineChart data={mockData} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders an AreaChart', () => {
    render(<ErrorTimelineChart data={mockData} />);
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
  });

  it('renders XAxis with date dataKey', () => {
    render(<ErrorTimelineChart data={mockData} />);
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(capturedProps['x-axis']).toHaveProperty('dataKey', 'date');
  });

  it('renders two Area elements for errors and retries', () => {
    render(<ErrorTimelineChart data={mockData} />);
    const areas = screen.getAllByTestId('area');
    expect(areas).toHaveLength(2);
  });

  it('renders with empty data', () => {
    render(<ErrorTimelineChart data={[]} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });
});
