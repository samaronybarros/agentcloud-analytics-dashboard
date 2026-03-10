import React from 'react';
import { render, screen } from '@testing-library/react';
import type { Alert } from '@/lib/types';

jest.mock('@/lib/hooks/use-analytics', () => ({
  useAlerts: jest.fn(),
}));

jest.mock('@/lib/hooks/use-date-range', () => ({
  useDateRange: () => ({ range: {}, preset: 'all', setPreset: jest.fn() }),
}));

jest.mock('@/lib/hooks/use-role', () => ({
  useRole: () => ({ role: 'admin' }),
}));

import AlertsPage from '@/app/dashboard/alerts/page';
import { useAlerts } from '@/lib/hooks/use-analytics';

const mockUseAlerts = useAlerts as jest.Mock;

const mockAlerts: Alert[] = [
  {
    id: 'a1',
    metric: 'success-rate',
    status: 'breached',
    title: 'Low success rate',
    description: 'Below threshold',
    currentValue: 0.72,
    threshold: 0.8,
  },
  {
    id: 'a2',
    metric: 'cost',
    status: 'ok',
    title: 'Cost within budget',
    description: 'Under threshold',
    currentValue: 350,
    threshold: 500,
  },
];

describe('AlertsPage', () => {
  beforeEach(() => {
    mockUseAlerts.mockReturnValue({
      data: { alerts: mockAlerts, breachedCount: 1 },
      isLoading: false,
    });
  });

  it('renders the page heading', () => {
    render(<AlertsPage />);
    expect(screen.getByRole('heading', { name: 'Alerts' })).toBeInTheDocument();
  });

  it('renders Breached section for breached alerts', () => {
    render(<AlertsPage />);
    expect(screen.getByRole('heading', { name: 'Breached' })).toBeInTheDocument();
    expect(screen.getByText('Low success rate')).toBeInTheDocument();
  });

  it('renders Passing section for ok alerts', () => {
    render(<AlertsPage />);
    expect(screen.getByRole('heading', { name: 'Passing' })).toBeInTheDocument();
    expect(screen.getByText('Cost within budget')).toBeInTheDocument();
  });

  it('shows breached count summary', () => {
    render(<AlertsPage />);
    expect(screen.getByText('1 of 2 alerts breached')).toBeInTheDocument();
  });

  it('shows loading state with skeletons', () => {
    mockUseAlerts.mockReturnValue({ data: undefined, isLoading: true });
    render(<AlertsPage />);
    expect(screen.getByRole('heading', { name: 'Alerts' })).toBeInTheDocument();
    expect(screen.getAllByTestId('skeleton').length).toBeGreaterThanOrEqual(3);
  });

  it('shows error state when query fails', () => {
    mockUseAlerts.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Alerts service unavailable'),
    });
    render(<AlertsPage />);
    expect(screen.getByRole('heading', { name: 'Alerts' })).toBeInTheDocument();
    expect(screen.getByTestId('error-state')).toBeInTheDocument();
    expect(screen.getByText('Alerts service unavailable')).toBeInTheDocument();
  });

  it('shows empty state when no alerts', () => {
    mockUseAlerts.mockReturnValue({
      data: { alerts: [], breachedCount: 0 },
      isLoading: false,
    });
    render(<AlertsPage />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });
});
