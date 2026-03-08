import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardLayout from '@/app/dashboard/layout';

describe('DashboardLayout', () => {
  it('renders the AgentCloud brand name', () => {
    render(
      <DashboardLayout>
        <p>Page content</p>
      </DashboardLayout>,
    );
    expect(screen.getByText('AgentCloud')).toBeInTheDocument();
  });

  it('renders all four navigation links', () => {
    render(
      <DashboardLayout>
        <p>Content</p>
      </DashboardLayout>,
    );
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Agents')).toBeInTheDocument();
    expect(screen.getByText('Teams')).toBeInTheDocument();
    expect(screen.getByText('Optimization')).toBeInTheDocument();
  });

  it('links point to correct paths', () => {
    render(
      <DashboardLayout>
        <p>Content</p>
      </DashboardLayout>,
    );
    expect(screen.getByText('Overview').closest('a')).toHaveAttribute('href', '/dashboard');
    expect(screen.getByText('Agents').closest('a')).toHaveAttribute('href', '/dashboard/agents');
    expect(screen.getByText('Teams').closest('a')).toHaveAttribute('href', '/dashboard/teams');
    expect(screen.getByText('Optimization').closest('a')).toHaveAttribute('href', '/dashboard/optimization');
  });

  it('renders children in the main area', () => {
    render(
      <DashboardLayout>
        <p data-testid="page-content">Hello</p>
      </DashboardLayout>,
    );
    expect(screen.getByTestId('page-content')).toBeInTheDocument();
  });

  it('has a nav element for accessibility', () => {
    render(
      <DashboardLayout>
        <p>Content</p>
      </DashboardLayout>,
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('has a main element for content', () => {
    render(
      <DashboardLayout>
        <p>Content</p>
      </DashboardLayout>,
    );
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
