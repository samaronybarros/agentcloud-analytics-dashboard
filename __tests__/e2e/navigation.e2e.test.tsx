/**
 * E2E-style test for sidebar navigation rendering and active state.
 * Tests the SidebarNav component with mocked usePathname, verifying all
 * nav links render and the correct one is highlighted per route.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

import SidebarNav from '@/components/dashboard/sidebar-nav';
import { usePathname } from 'next/navigation';

const mockUsePathname = usePathname as jest.Mock;

const routes = [
  { path: '/dashboard', label: 'Overview' },
  { path: '/dashboard/agents', label: 'Agents' },
  { path: '/dashboard/teams', label: 'Teams' },
  { path: '/dashboard/optimization', label: 'Optimization' },
];

describe('Navigation (e2e)', () => {
  it('renders all four navigation links', () => {
    mockUsePathname.mockReturnValue('/dashboard');
    render(<SidebarNav />);

    for (const route of routes) {
      expect(screen.getByRole('link', { name: route.label })).toBeInTheDocument();
    }
  });

  it('links point to the correct hrefs', () => {
    mockUsePathname.mockReturnValue('/dashboard');
    render(<SidebarNav />);

    for (const route of routes) {
      const link = screen.getByRole('link', { name: route.label });
      expect(link).toHaveAttribute('href', route.path);
    }
  });

  it.each(routes)(
    'highlights "$label" link when pathname is "$path"',
    ({ path, label }) => {
      mockUsePathname.mockReturnValue(path);
      render(<SidebarNav />);

      const activeLink = screen.getByRole('link', { name: label });
      expect(activeLink.className).toContain('bg-');

      // Other links should not have the active style
      for (const otherRoute of routes) {
        if (otherRoute.path !== path) {
          const otherLink = screen.getByRole('link', { name: otherRoute.label });
          expect(otherLink.className).not.toEqual(activeLink.className);
        }
      }
    },
  );

  it('renders the dashboard title', () => {
    mockUsePathname.mockReturnValue('/dashboard');
    render(<SidebarNav />);

    expect(screen.getByText('AgentCloud')).toBeInTheDocument();
  });
});
