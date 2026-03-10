import React from 'react';
import { render, screen } from '@testing-library/react';
import type { DayOfWeekEntry } from '@/lib/types';

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
  };
});

import { RunsByDayChart } from '@/components/charts/runs-by-day-chart';

const mockData: DayOfWeekEntry[] = [
  { day: 'Mon', runs: 80 },
  { day: 'Tue', runs: 95 },
  { day: 'Wed', runs: 70 },
  { day: 'Thu', runs: 85 },
  { day: 'Fri', runs: 60 },
  { day: 'Sat', runs: 30 },
  { day: 'Sun', runs: 25 },
];

describe('RunsByDayChart', () => {
  beforeEach(() => {
    Object.keys(capturedProps).forEach((key) => delete capturedProps[key]);
  });

  it('renders without crashing', () => {
    render(<RunsByDayChart data={mockData} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders a BarChart', () => {
    render(<RunsByDayChart data={mockData} />);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('renders XAxis with day names', () => {
    render(<RunsByDayChart data={mockData} />);
    expect(capturedProps['x-axis'].dataKey).toBe('day');
  });

  it('renders a Bar for run counts', () => {
    render(<RunsByDayChart data={mockData} />);
    expect(screen.getByTestId('bar')).toBeInTheDocument();
    expect(capturedProps['bar'].dataKey).toBe('runs');
  });

  it('passes data to the BarChart', () => {
    render(<RunsByDayChart data={mockData} />);
    expect(capturedProps['bar-chart'].data).toEqual(mockData);
  });

  it('renders with empty data', () => {
    render(<RunsByDayChart data={[]} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });
});
