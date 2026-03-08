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
});
