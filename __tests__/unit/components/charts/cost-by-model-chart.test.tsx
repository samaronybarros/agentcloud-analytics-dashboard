import React from 'react';
import { render, screen } from '@testing-library/react';
import type { CostByModelEntry } from '@/lib/types';

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

  it('renders a PieChart (donut)', () => {
    render(<CostByModelChart data={mockData} />);
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('renders a Pie element', () => {
    render(<CostByModelChart data={mockData} />);
    expect(screen.getByTestId('pie')).toBeInTheDocument();
  });

  it('renders one Cell per model', () => {
    render(<CostByModelChart data={mockData} />);
    const cells = screen.getAllByTestId('cell');
    expect(cells).toHaveLength(2);
  });

  it('renders a Legend', () => {
    render(<CostByModelChart data={mockData} />);
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('renders with empty data', () => {
    render(<CostByModelChart data={[]} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders with a single model', () => {
    render(<CostByModelChart data={[mockData[0]]} />);
    const cells = screen.getAllByTestId('cell');
    expect(cells).toHaveLength(1);
  });

  it('Tooltip formatter formats cost to two decimal places', () => {
    render(<CostByModelChart data={mockData} />);
    const formatter = capturedProps['tooltip'].formatter as (value: number) => string;
    expect(formatter(200)).toBe('$200.00');
    expect(formatter(0.5)).toBe('$0.50');
    expect(formatter(130)).toBe('$130.00');
  });
});
