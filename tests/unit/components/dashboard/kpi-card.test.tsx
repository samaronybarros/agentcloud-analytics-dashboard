import React from 'react';
import { render, screen } from '@testing-library/react';
import { KPICard } from '@/components/dashboard/kpi-card';

describe('KPICard', () => {
  it('renders label and value', () => {
    render(<KPICard label="Total Runs" value="500" />);
    expect(screen.getByText('Total Runs')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
  });

  it('renders detail when provided', () => {
    render(<KPICard label="Tokens" value="1,234" detail="input + output" />);
    expect(screen.getByText('input + output')).toBeInTheDocument();
  });

  it('does not render detail when not provided', () => {
    const { container } = render(<KPICard label="Cost" value="$10.00" />);
    const detailElements = container.querySelectorAll('.text-xs');
    expect(detailElements).toHaveLength(0);
  });
});
