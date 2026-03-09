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

  it('renders large formatted values correctly', () => {
    render(<KPICard label="Token Volume" value="1,523,847" />);
    expect(screen.getByText('1,523,847')).toBeInTheDocument();
  });

  it('renders zero values', () => {
    render(<KPICard label="Errors" value="0" />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders dollar-formatted values', () => {
    render(<KPICard label="Estimated Cost" value="$4,312.57" />);
    expect(screen.getByText('$4,312.57')).toBeInTheDocument();
  });

  it('renders percentage values', () => {
    render(<KPICard label="Success Rate" value="74.4%" />);
    expect(screen.getByText('74.4%')).toBeInTheDocument();
  });
});
