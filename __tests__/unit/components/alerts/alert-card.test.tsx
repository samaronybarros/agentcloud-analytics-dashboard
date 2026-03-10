import React from 'react';
import { render, screen } from '@testing-library/react';
import { AlertCard } from '@/components/alerts/alert-card';
import type { Alert } from '@/lib/types';

const breachedAlert: Alert = {
  id: 'a1',
  metric: 'success-rate',
  status: 'breached',
  title: 'Low success rate',
  description: 'Success rate has dropped below threshold',
  currentValue: 0.72,
  threshold: 0.8,
};

const okAlert: Alert = {
  id: 'a2',
  metric: 'cost',
  status: 'ok',
  title: 'Cost within budget',
  description: 'Spending is under the configured limit',
  currentValue: 350,
  threshold: 500,
};

const latencyAlert: Alert = {
  id: 'a3',
  metric: 'latency',
  status: 'breached',
  title: 'High latency detected',
  description: 'Latency exceeds threshold',
  currentValue: 4500,
  threshold: 3000,
};

describe('AlertCard', () => {
  it('renders alert title', () => {
    render(<AlertCard alert={breachedAlert} />);
    expect(screen.getByText('Low success rate')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<AlertCard alert={breachedAlert} />);
    expect(screen.getByText('Success rate has dropped below threshold')).toBeInTheDocument();
  });

  it('shows breached styling for breached alerts', () => {
    const { container } = render(<AlertCard alert={breachedAlert} />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('border-red-200');
    expect(card.className).toContain('bg-red-50');
    expect(card.className).toContain('text-red-800');
  });

  it('shows ok styling for ok alerts', () => {
    const { container } = render(<AlertCard alert={okAlert} />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('border-green-200');
    expect(card.className).toContain('bg-green-50');
    expect(card.className).toContain('text-green-800');
  });

  it('formats success-rate metric as percentage', () => {
    render(<AlertCard alert={breachedAlert} />);
    expect(screen.getByText(/72\.0%/)).toBeInTheDocument();
    expect(screen.getByText(/80\.0%/)).toBeInTheDocument();
  });

  it('formats cost metric as dollar amount', () => {
    render(<AlertCard alert={okAlert} />);
    expect(screen.getByText(/\$350\.00/)).toBeInTheDocument();
    expect(screen.getByText(/\$500\.00/)).toBeInTheDocument();
  });

  it('formats latency metric as milliseconds', () => {
    render(<AlertCard alert={latencyAlert} />);
    expect(screen.getByText(/4500ms/)).toBeInTheDocument();
    expect(screen.getByText(/3000ms/)).toBeInTheDocument();
  });
});
