import React from 'react';
import { render, screen } from '@testing-library/react';
import { ErrorState } from '@/components/dashboard/error-state';

describe('ErrorState', () => {
  it('renders the default error message', () => {
    render(<ErrorState />);
    expect(
      screen.getByText('Something went wrong while loading data.'),
    ).toBeInTheDocument();
  });

  it('renders a custom error message', () => {
    render(<ErrorState message="Failed to load agents." />);
    expect(screen.getByText('Failed to load agents.')).toBeInTheDocument();
  });

  it('displays the error detail when provided', () => {
    render(<ErrorState detail="Network timeout" />);
    expect(screen.getByText('Network timeout')).toBeInTheDocument();
  });

  it('hides error detail when not provided', () => {
    const { container } = render(<ErrorState />);
    expect(container.querySelector('[data-testid="error-detail"]')).not.toBeInTheDocument();
  });

  it('has a recognizable test id', () => {
    render(<ErrorState />);
    expect(screen.getByTestId('error-state')).toBeInTheDocument();
  });

  it('renders the retry hint by default', () => {
    render(<ErrorState />);
    expect(screen.getByText(/Try refreshing the page/)).toBeInTheDocument();
  });

  it('hides the retry hint when showHint is false', () => {
    render(<ErrorState showHint={false} />);
    expect(screen.queryByText(/Try refreshing the page/)).not.toBeInTheDocument();
  });
});
