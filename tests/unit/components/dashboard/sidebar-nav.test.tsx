import React from 'react';
import { render, screen, within } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('next/link', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) =>
      React.createElement('a', { href, className, 'data-testid': 'next-link' }, children),
  };
});

import SidebarNav from '@/components/dashboard/sidebar-nav';
import { usePathname } from 'next/navigation';

const mockUsePathname = usePathname as jest.Mock;

describe('SidebarNav', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/dashboard');
  });

  it('renders the brand name', () => {
    render(<SidebarNav />);
    expect(screen.getByText('AgentCloud')).toBeInTheDocument();
  });

  it('renders all four nav links', () => {
    render(<SidebarNav />);
    const nav = screen.getByRole('navigation');
    const links = within(nav).getAllByRole('link');
    expect(links).toHaveLength(4);
  });

  it('applies active styles to the current route', () => {
    mockUsePathname.mockReturnValue('/dashboard/teams');
    render(<SidebarNav />);
    const teamsLink = screen.getByText('Teams').closest('a')!;
    expect(teamsLink.className).toContain('font-medium');
    expect(teamsLink.className).toContain('text-gray-900');
  });

  it('applies inactive styles to non-current routes', () => {
    mockUsePathname.mockReturnValue('/dashboard/teams');
    render(<SidebarNav />);
    const overviewLink = screen.getByText('Overview').closest('a')!;
    const agentsLink = screen.getByText('Agents').closest('a')!;
    const optimizationLink = screen.getByText('Optimization').closest('a')!;
    expect(overviewLink.className).toContain('text-gray-600');
    expect(agentsLink.className).toContain('text-gray-600');
    expect(optimizationLink.className).toContain('text-gray-600');
  });

  it('does not highlight Overview when on a sub-page', () => {
    mockUsePathname.mockReturnValue('/dashboard/agents');
    render(<SidebarNav />);
    const overviewLink = screen.getByText('Overview').closest('a')!;
    expect(overviewLink.className).toContain('text-gray-600');
    expect(overviewLink.className).not.toContain('font-medium');
  });

  it('uses Next.js Link for client-side navigation', () => {
    render(<SidebarNav />);
    const nav = screen.getByRole('navigation');
    const nextLinks = within(nav).getAllByTestId('next-link');
    expect(nextLinks).toHaveLength(4);
  });

  it('produces consistent className output for same pathname across renders', () => {
    mockUsePathname.mockReturnValue('/dashboard/optimization');
    const { container: firstRender } = render(<SidebarNav />);
    const firstHTML = firstRender.innerHTML;

    const { container: secondRender } = render(<SidebarNav />);
    const secondHTML = secondRender.innerHTML;

    expect(firstHTML).toBe(secondHTML);
  });
});
