import React from 'react';
import { render, screen } from '@testing-library/react';
import { ModelPerformanceTable } from '@/components/tables/model-performance-table';
import type { ModelPerformanceEntry } from '@/lib/types';

const mockData: ModelPerformanceEntry[] = [
  {
    model: 'claude-sonnet-4-20250514',
    totalRuns: 200,
    successRate: 0.92,
    avgLatencyMs: 2400,
    totalCost: 180.5,
    costPerThousandTokens: 0.0032,
    totalTokens: 56000,
  },
  {
    model: 'gpt-4o',
    totalRuns: 150,
    successRate: 0.65,
    avgLatencyMs: 3100,
    totalCost: 220.0,
    costPerThousandTokens: 0.0045,
    totalTokens: 48000,
  },
];

describe('ModelPerformanceTable', () => {
  it('renders table headers', () => {
    render(<ModelPerformanceTable data={mockData} />);
    expect(screen.getByText('Model')).toBeInTheDocument();
    expect(screen.getByText('Runs')).toBeInTheDocument();
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Avg Latency')).toBeInTheDocument();
    expect(screen.getByText('Cost')).toBeInTheDocument();
    expect(screen.getByText('Cost/1K Tokens')).toBeInTheDocument();
    expect(screen.getByText('Tokens')).toBeInTheDocument();
  });

  it('renders one row per model', () => {
    render(<ModelPerformanceTable data={mockData} />);
    expect(screen.getByText('claude-sonnet-4-20250514')).toBeInTheDocument();
    expect(screen.getByText('gpt-4o')).toBeInTheDocument();
  });

  it('applies green color for high success rate (>= 90%)', () => {
    render(<ModelPerformanceTable data={mockData} />);
    const highSuccess = screen.getByText('92.0%');
    expect(highSuccess.className).toContain('text-green-600');
  });

  it('applies red color for low success rate (< 70%)', () => {
    render(<ModelPerformanceTable data={mockData} />);
    const lowSuccess = screen.getByText('65.0%');
    expect(lowSuccess.className).toContain('text-red-600');
  });

  it('applies amber color for medium success rate (70%–89%)', () => {
    const mediumData: ModelPerformanceEntry[] = [
      {
        model: 'gpt-4o',
        totalRuns: 100,
        successRate: 0.82,
        avgLatencyMs: 2000,
        totalCost: 90.0,
        costPerThousandTokens: 0.003,
        totalTokens: 30000,
      },
    ];
    render(<ModelPerformanceTable data={mediumData} />);
    const mediumSuccess = screen.getByText('82.0%');
    expect(mediumSuccess.className).toContain('text-amber-600');
  });

  it('formats cost with dollar sign', () => {
    render(<ModelPerformanceTable data={mockData} />);
    expect(screen.getByText('$180.50')).toBeInTheDocument();
    expect(screen.getByText('$220.00')).toBeInTheDocument();
  });

  it('formats costPerThousandTokens with dollar sign and four decimals', () => {
    render(<ModelPerformanceTable data={mockData} />);
    expect(screen.getByText('$0.0032')).toBeInTheDocument();
    expect(screen.getByText('$0.0045')).toBeInTheDocument();
  });

  it('renders empty table body with no data', () => {
    render(<ModelPerformanceTable data={[]} />);
    expect(screen.getByText('Model')).toBeInTheDocument();
    const rows = screen.queryAllByRole('row');
    expect(rows).toHaveLength(1);
  });
});
