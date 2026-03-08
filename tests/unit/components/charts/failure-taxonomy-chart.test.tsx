import React from 'react';
import { render, screen } from '@testing-library/react';
import type { FailureTaxonomyEntry } from '@/lib/types';

jest.mock('recharts', () => {
  const React = require('react');
  const mock = (name: string) =>
    ({ children }: { children?: React.ReactNode }) =>
      React.createElement('div', { 'data-testid': name }, children);
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

import { FailureTaxonomyChart } from '@/components/charts/failure-taxonomy-chart';

const mockData: FailureTaxonomyEntry[] = [
  { errorType: 'timeout', count: 30, percentage: 0.5 },
  { errorType: 'rate-limit', count: 20, percentage: 0.333 },
  { errorType: 'auth-failure', count: 10, percentage: 0.167 },
];

describe('FailureTaxonomyChart', () => {
  it('renders without crashing', () => {
    render(<FailureTaxonomyChart data={mockData} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders with empty data', () => {
    render(<FailureTaxonomyChart data={[]} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });
});
