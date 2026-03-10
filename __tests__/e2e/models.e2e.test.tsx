/**
 * E2E-style test for the Models page.
 * Mocks at the fetch level — full data flow from API to rendered DOM.
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import type { ModelsResponse } from '@/lib/types';
import { createE2EWrapper, setupFetchMock, jsonResponse, errorResponse } from './helpers';

jest.mock('recharts', () => {
  const React = require('react');
  const mock = (name: string) =>
    ({ children }: { children?: React.ReactNode }) =>
      React.createElement('div', { 'data-testid': name }, children);
  return {
    ResponsiveContainer: mock('responsive-container'),
    PieChart: mock('pie-chart'),
    Pie: mock('pie'),
    Cell: mock('cell'),
    Tooltip: mock('tooltip'),
    Legend: mock('legend'),
    BarChart: mock('bar-chart'),
    Bar: mock('bar'),
    XAxis: mock('x-axis'),
    YAxis: mock('y-axis'),
    CartesianGrid: mock('cartesian-grid'),
  };
});

import ModelsPage from '@/app/dashboard/models/page';

const modelsData: ModelsResponse = {
  models: [
    { model: 'claude-sonnet-4-20250514', totalRuns: 200, successRate: 0.88, avgLatencyMs: 2400, totalCost: 180.5, costPerThousandTokens: 0.0032, totalTokens: 56000 },
    { model: 'gpt-4o', totalRuns: 150, successRate: 0.76, avgLatencyMs: 3100, totalCost: 220.0, costPerThousandTokens: 0.0045, totalTokens: 48000 },
  ],
};

const fetchMock = setupFetchMock();

function mockSuccessfulFetch() {
  fetchMock.mockImplementation((url: string) => {
    if (url.includes('/api/analytics/models')) return Promise.resolve(jsonResponse(modelsData));
    return Promise.resolve(errorResponse(404));
  });
}

describe('Models page (e2e)', () => {
  it('renders model data from API', async () => {
    mockSuccessfulFetch();
    render(<ModelsPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByText('claude-sonnet-4-20250514')).toBeInTheDocument();
    });

    expect(screen.getByText('gpt-4o')).toBeInTheDocument();
  });

  it('renders Model Performance section', async () => {
    mockSuccessfulFetch();
    render(<ModelsPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Model Performance' })).toBeInTheDocument();
    });
  });

  it('shows loading skeletons before data arrives', () => {
    fetchMock.mockImplementation(() => new Promise(() => {}));
    render(<ModelsPage />, { wrapper: createE2EWrapper() });

    expect(screen.getAllByTestId('table-row-skeleton').length).toBeGreaterThan(0);
  });

  it('shows error state when the API fails', async () => {
    fetchMock.mockImplementation(() => Promise.resolve(errorResponse()));
    render(<ModelsPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });
  });

  it('shows empty state when models is empty', async () => {
    const emptyData: ModelsResponse = { models: [] };
    fetchMock.mockImplementation((url: string) => {
      if (url.includes('/api/analytics/models')) return Promise.resolve(jsonResponse(emptyData));
      return Promise.resolve(errorResponse(404));
    });

    render(<ModelsPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
  });

  it('calls the models API endpoint', async () => {
    mockSuccessfulFetch();
    render(<ModelsPage />, { wrapper: createE2EWrapper() });

    await waitFor(() => {
      expect(screen.getByText('claude-sonnet-4-20250514')).toBeInTheDocument();
    });

    const calledUrls = fetchMock.mock.calls.map((call: unknown[]) => call[0]);
    expect(calledUrls).toContainEqual(expect.stringContaining('/api/analytics/models'));
  });
});
