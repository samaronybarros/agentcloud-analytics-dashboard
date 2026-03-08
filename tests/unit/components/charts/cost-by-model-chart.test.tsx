import React from 'react';
import { render, screen } from '@testing-library/react';
import type { CostByModelEntry } from '@/lib/types';

jest.mock('recharts', () => {
  const React = require('react');
  const mock = (name: string) =>
    ({ children }: { children?: React.ReactNode }) =>
      React.createElement('div', { 'data-testid': name }, children);
  return {
    ResponsiveContainer: mock('responsive-container'),
    PieChart: mock('pie-chart'),
    Pie: mock('pie'),
    Cell: mock('cell'),
    Tooltip: mock('tooltip'),
    Legend: mock('legend'),
  };
});

import { CostByModelChart } from '@/components/charts/cost-by-model-chart';

const mockData: CostByModelEntry[] = [
  { model: 'claude-sonnet-4-20250514', totalCost: 200.0, percentage: 0.6 },
  { model: 'gpt-4o', totalCost: 130.0, percentage: 0.4 },
];

describe('CostByModelChart', () => {
  it('renders without crashing', () => {
    render(<CostByModelChart data={mockData} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders with empty data', () => {
    render(<CostByModelChart data={[]} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });
});
