/**
 * E2E-style test for sidebar navigation rendering and active state.
 * Tests the SidebarNav component with mocked usePathname, verifying all
 * nav links render and the correct one is highlighted per route.
 */
import React from 'react';
import { render, screen, within } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('@/lib/hooks/use-role', () => {
  const actual = jest.requireActual('@/lib/hooks/use-role');
  return {
    ...actual,
    useRole: () => ({ role: 'admin', setRole: jest.fn() }),
  };
});

import SidebarNav from '@/components/dashboard/sidebar-nav';
import { RoleProvider } from '@/lib/hooks/use-role';
import { usePathname } from 'next/navigation';

const mockUsePathname = usePathname as jest.Mock;

const routes = [
  { path: '/dashboard', label: 'Overview' },
  { path: '/dashboard/agents', label: 'Agents' },
  { path: '/dashboard/teams', label: 'Teams' },
  { path: '/dashboard/optimization', label: 'Optimization' },
];

/**
 * Helper: returns the desktop navigation element.
 * The responsive sidebar renders two <nav> elements (mobile + desktop).
 * In JSDOM both are present; the desktop nav is the last one.
 */
function getDesktopNav(): HTMLElement {
  const navs = screen.getAllByRole('navigation');
  return navs[navs.length - 1];
}

function renderNav() {
  return render(<RoleProvider><SidebarNav /></RoleProvider>);
}

describe('Navigation (e2e)', () => {
  it('renders all four navigation links', () => {
    mockUsePathname.mockReturnValue('/dashboard');
    renderNav();

    const nav = getDesktopNav();
    for (const route of routes) {
      expect(within(nav).getByRole('link', { name: route.label })).toBeInTheDocument();
    }
  });

  it('links point to the correct hrefs', () => {
    mockUsePathname.mockReturnValue('/dashboard');
    renderNav();

    const nav = getDesktopNav();
    for (const route of routes) {
      const link = within(nav).getByRole('link', { name: route.label });
      expect(link).toHaveAttribute('href', route.path);
    }
  });

  it.each(routes)(
    'highlights "$label" link when pathname is "$path"',
    ({ path, label }) => {
      mockUsePathname.mockReturnValue(path);
      renderNav();

      const nav = getDesktopNav();
      const activeLink = within(nav).getByRole('link', { name: label });
      expect(activeLink.className).toContain('font-medium');

      // Other links should not have the active style
      for (const otherRoute of routes) {
        if (otherRoute.path !== path) {
          const otherLink = within(nav).getByRole('link', { name: otherRoute.label });
          expect(otherLink.className).not.toEqual(activeLink.className);
        }
      }
    },
  );

  it('renders the dashboard title', () => {
    mockUsePathname.mockReturnValue('/dashboard');
    renderNav();

    const brandElements = screen.getAllByText('AgentCloud');
    expect(brandElements.length).toBeGreaterThanOrEqual(1);
  });
});
