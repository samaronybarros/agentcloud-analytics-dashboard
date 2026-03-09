import React from 'react';
import { render, screen } from '@testing-library/react';
import { InsightCard } from '@/components/insights/insight-card';
import type { Insight } from '@/lib/types';

const baseInsight: Insight = {
  id: 'insight-1',
  type: 'top-cost-driver',
  severity: 'info',
  title: 'DataSync is the top cost driver',
  description: 'This agent has accumulated $150.00 in estimated costs.',
};

describe('InsightCard', () => {
  it('renders title and description', () => {
    render(<InsightCard insight={baseInsight} />);
    expect(screen.getByText('DataSync is the top cost driver')).toBeInTheDocument();
    expect(
      screen.getByText('This agent has accumulated $150.00 in estimated costs.'),
    ).toBeInTheDocument();
  });

  it('renders severity label for info', () => {
    render(<InsightCard insight={baseInsight} />);
    expect(screen.getByText('Info')).toBeInTheDocument();
  });

  it('renders severity label for warning', () => {
    render(
      <InsightCard insight={{ ...baseInsight, severity: 'warning' }} />,
    );
    expect(screen.getByText('Warning')).toBeInTheDocument();
  });

  it('renders severity label for critical', () => {
    render(
      <InsightCard insight={{ ...baseInsight, severity: 'critical' }} />,
    );
    expect(screen.getByText('Critical')).toBeInTheDocument();
  });

  it('applies info styling classes', () => {
    const { container } = render(<InsightCard insight={baseInsight} />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('border-blue-200');
    expect(card.className).toContain('bg-blue-50');
  });

  it('applies warning styling classes', () => {
    const { container } = render(
      <InsightCard insight={{ ...baseInsight, severity: 'warning' }} />,
    );
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('border-amber-200');
    expect(card.className).toContain('bg-amber-50');
  });

  it('applies critical styling classes', () => {
    const { container } = render(
      <InsightCard insight={{ ...baseInsight, severity: 'critical' }} />,
    );
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('border-red-200');
    expect(card.className).toContain('bg-red-50');
  });

  it('renders high-cost-low-success insight type', () => {
    render(
      <InsightCard
        insight={{
          ...baseInsight,
          type: 'high-cost-low-success',
          severity: 'critical',
          title: 'DeployBot has high cost with low success',
          description: 'Success rate is 45.0% while cost is $200.00.',
        }}
      />,
    );
    expect(screen.getByText('DeployBot has high cost with low success')).toBeInTheDocument();
    expect(screen.getByText('Critical')).toBeInTheDocument();
  });

  it('renders degraded-latency insight type', () => {
    render(
      <InsightCard
        insight={{
          ...baseInsight,
          type: 'degraded-latency',
          severity: 'warning',
          title: 'TestRunner has elevated latency',
          description: 'Average latency is 8500ms, above the 75th percentile.',
        }}
      />,
    );
    expect(screen.getByText('TestRunner has elevated latency')).toBeInTheDocument();
  });

  it('renders rising-failures insight type', () => {
    render(
      <InsightCard
        insight={{
          ...baseInsight,
          type: 'rising-failures',
          severity: 'warning',
          title: 'AlertMonitor has a high failure rate',
          description: 'Only 60.0% of 50 runs succeeded.',
        }}
      />,
    );
    expect(screen.getByText('AlertMonitor has a high failure rate')).toBeInTheDocument();
  });
});
