import React from 'react';
import { render, screen } from '@testing-library/react';
import type { Insight } from '@/lib/types';

jest.mock('@/lib/hooks/use-analytics', () => ({
  useInsights: jest.fn(),
}));

jest.mock('@/lib/hooks/use-date-range', () => ({
  useDateRange: () => ({ range: {}, preset: 'all', setPreset: jest.fn() }),
}));

jest.mock('@/lib/hooks/use-role', () => ({
  useRole: () => ({ role: 'admin', setRole: jest.fn() }),
}));

import OptimizationPage from '@/app/dashboard/optimization/page';
import { useInsights } from '@/lib/hooks/use-analytics';

const mockUseInsights = useInsights as jest.Mock;

const mockInsights: Insight[] = [
  {
    id: 'i1', type: 'top-cost-driver', severity: 'info',
    title: 'DataSync is the top cost driver',
    description: '$150.00 in costs.',
  },
  {
    id: 'i2', type: 'high-cost-low-success', severity: 'critical',
    title: 'DeployBot has high cost with low success',
    description: 'Success rate is 45.0%.',
  },
  {
    id: 'i3', type: 'degraded-latency', severity: 'warning',
    title: 'TestRunner has elevated latency',
    description: 'Average latency is 8500ms.',
  },
];

describe('OptimizationPage', () => {
  beforeEach(() => {
    mockUseInsights.mockReturnValue({ data: { insights: mockInsights }, isLoading: false });
  });

  it('renders the page heading', () => {
    render(<OptimizationPage />);
    expect(screen.getByRole('heading', { name: 'Optimization' })).toBeInTheDocument();
  });

  it('renders Critical section for critical insights', () => {
    render(<OptimizationPage />);
    expect(screen.getByRole('heading', { name: 'Critical' })).toBeInTheDocument();
    expect(screen.getByText('DeployBot has high cost with low success')).toBeInTheDocument();
  });

  it('renders Warnings section for warning insights', () => {
    render(<OptimizationPage />);
    expect(screen.getByRole('heading', { name: 'Warnings' })).toBeInTheDocument();
    expect(screen.getByText('TestRunner has elevated latency')).toBeInTheDocument();
  });

  it('renders Information section for info insights', () => {
    render(<OptimizationPage />);
    expect(screen.getByRole('heading', { name: 'Information' })).toBeInTheDocument();
    expect(screen.getByText('DataSync is the top cost driver')).toBeInTheDocument();
  });

  it('shows empty state when no insights', () => {
    mockUseInsights.mockReturnValue({ data: { insights: [] }, isLoading: false });
    render(<OptimizationPage />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText(/No optimization insights/)).toBeInTheDocument();
  });

  it('hides Critical section when no critical insights', () => {
    const noCtitical = mockInsights.filter((i) => i.severity !== 'critical');
    mockUseInsights.mockReturnValue({ data: { insights: noCtitical }, isLoading: false });
    render(<OptimizationPage />);
    expect(screen.queryByRole('heading', { name: 'Critical' })).not.toBeInTheDocument();
  });

  it('hides Warnings section when no warning insights', () => {
    const noWarnings = mockInsights.filter((i) => i.severity !== 'warning');
    mockUseInsights.mockReturnValue({ data: { insights: noWarnings }, isLoading: false });
    render(<OptimizationPage />);
    expect(screen.queryByRole('heading', { name: 'Warnings' })).not.toBeInTheDocument();
  });

  it('wraps each severity group in a card container matching other pages', () => {
    const { container } = render(<OptimizationPage />);
    const cardWrappers = container.querySelectorAll('.rounded-lg.border.border-gray-200.bg-white.p-4');
    // 3 severity groups: Critical, Warnings, Information
    expect(cardWrappers.length).toBe(3);
  });

  it('shows loading state with section-based skeletons', () => {
    mockUseInsights.mockReturnValue({ data: undefined, isLoading: true });
    render(<OptimizationPage />);
    expect(screen.getByRole('heading', { name: 'Optimization' })).toBeInTheDocument();
    expect(screen.getAllByTestId('skeleton').length).toBeGreaterThanOrEqual(3);
  });

  it('shows error state when query fails', () => {
    mockUseInsights.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Insights service unavailable'),
    });
    render(<OptimizationPage />);
    expect(screen.getByRole('heading', { name: 'Optimization' })).toBeInTheDocument();
    expect(screen.getByTestId('error-state')).toBeInTheDocument();
    expect(screen.getByText('Insights service unavailable')).toBeInTheDocument();
  });
});
