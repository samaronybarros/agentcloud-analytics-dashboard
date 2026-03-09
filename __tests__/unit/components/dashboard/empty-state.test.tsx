import React from 'react';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '@/components/dashboard/empty-state';

describe('EmptyState', () => {
  it('renders the default message', () => {
    render(<EmptyState />);
    expect(screen.getByText('No data available for the selected time period.')).toBeInTheDocument();
  });

  it('renders a custom message', () => {
    render(<EmptyState message="Nothing to see here." />);
    expect(screen.getByText('Nothing to see here.')).toBeInTheDocument();
  });

  it('renders the suggestion to adjust date range', () => {
    render(<EmptyState />);
    expect(screen.getByText(/Try selecting a different date range/)).toBeInTheDocument();
  });

  it('hides suggestion when showHint is false', () => {
    render(<EmptyState showHint={false} />);
    expect(screen.queryByText(/Try selecting a different date range/)).not.toBeInTheDocument();
  });

  it('has a recognizable test id', () => {
    render(<EmptyState />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });
});
