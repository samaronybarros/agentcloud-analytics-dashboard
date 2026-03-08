import React from 'react';
import { render, screen } from '@testing-library/react';
import { Skeleton, KPICardSkeleton, ChartSkeleton, TableSkeleton } from '@/components/dashboard/skeleton';

describe('Skeleton', () => {
  it('renders a div with animate-pulse class', () => {
    render(<Skeleton className="h-6 w-24" />);
    const el = screen.getByTestId('skeleton');
    expect(el.className).toContain('animate-pulse');
  });

  it('applies custom className', () => {
    render(<Skeleton className="h-10 w-full" />);
    const el = screen.getByTestId('skeleton');
    expect(el.className).toContain('h-10');
    expect(el.className).toContain('w-full');
  });
});

describe('KPICardSkeleton', () => {
  it('renders with the same card styling as KPICard', () => {
    render(<KPICardSkeleton />);
    const card = screen.getByTestId('kpi-skeleton');
    expect(card.className).toContain('rounded-lg');
    expect(card.className).toContain('border');
  });

  it('contains animated placeholder elements', () => {
    const { container } = render(<KPICardSkeleton />);
    const pulsingElements = container.querySelectorAll('.animate-pulse');
    expect(pulsingElements.length).toBeGreaterThanOrEqual(2);
  });
});

describe('ChartSkeleton', () => {
  it('renders a placeholder with appropriate height', () => {
    render(<ChartSkeleton />);
    const el = screen.getByTestId('chart-skeleton');
    expect(el.className).toContain('animate-pulse');
  });
});

describe('TableSkeleton', () => {
  it('renders multiple row placeholders', () => {
    render(<TableSkeleton rows={5} />);
    const rows = screen.getAllByTestId('table-row-skeleton');
    expect(rows).toHaveLength(5);
  });

  it('defaults to 3 rows', () => {
    render(<TableSkeleton />);
    const rows = screen.getAllByTestId('table-row-skeleton');
    expect(rows).toHaveLength(3);
  });
});
