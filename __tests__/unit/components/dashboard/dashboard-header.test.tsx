import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('@/components/dashboard/date-range-picker', () => ({
  DateRangePicker: () => <div data-testid="date-range-picker" />,
}));

import { DashboardHeader } from '@/components/dashboard/dashboard-header';

describe('DashboardHeader', () => {
  it('renders the date range picker', () => {
    render(<DashboardHeader />);
    expect(screen.getByTestId('date-range-picker')).toBeInTheDocument();
  });

  it('renders a container element', () => {
    const { container } = render(<DashboardHeader />);
    expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
  });
});
