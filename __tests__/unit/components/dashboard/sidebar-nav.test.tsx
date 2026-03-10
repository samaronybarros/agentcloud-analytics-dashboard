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
import { RoleProvider } from '@/lib/hooks/use-role';
import { usePathname } from 'next/navigation';

const mockUsePathname = usePathname as jest.Mock;

function renderNav() {
  return render(
    <RoleProvider>
      <SidebarNav />
    </RoleProvider>,
  );
}

/**
 * Helper: returns the desktop navigation element.
 * The responsive sidebar renders two <nav> elements (mobile + desktop).
 * In JSDOM both are present; the desktop nav is the last one.
 */
function getDesktopNav(): HTMLElement {
  const navs = screen.getAllByRole('navigation');
  return navs[navs.length - 1];
}

describe('SidebarNav', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/dashboard');
  });

  it('renders the brand name', () => {
    renderNav();
    const brandElements = screen.getAllByText('AgentCloud');
    expect(brandElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders six nav links for engineer role (default, Teams hidden)', () => {
    renderNav();
    const nav = getDesktopNav();
    const links = within(nav).getAllByRole('link');
    expect(links).toHaveLength(6);
    expect(within(nav).queryByText('Teams')).not.toBeInTheDocument();
  });

  it('applies active styles to the current route', () => {
    mockUsePathname.mockReturnValue('/dashboard/agents');
    renderNav();
    const nav = getDesktopNav();
    const agentsLink = within(nav).getByText('Agents').closest('a')!;
    expect(agentsLink.className).toContain('font-medium');
    expect(agentsLink.className).toContain('text-gray-900');
  });

  it('applies inactive styles to non-current routes', () => {
    mockUsePathname.mockReturnValue('/dashboard/agents');
    renderNav();
    const nav = getDesktopNav();
    const overviewLink = within(nav).getByText('Overview').closest('a')!;
    const modelsLink = within(nav).getByText('Models').closest('a')!;
    const optimizationLink = within(nav).getByText('Optimization').closest('a')!;
    expect(overviewLink.className).toContain('text-gray-600');
    expect(modelsLink.className).toContain('text-gray-600');
    expect(optimizationLink.className).toContain('text-gray-600');
  });

  it('does not highlight Overview when on a sub-page', () => {
    mockUsePathname.mockReturnValue('/dashboard/agents');
    renderNav();
    const nav = getDesktopNav();
    const overviewLink = within(nav).getByText('Overview').closest('a')!;
    expect(overviewLink.className).toContain('text-gray-600');
    expect(overviewLink.className).not.toContain('font-medium');
  });

  it('uses Next.js Link for client-side navigation', () => {
    renderNav();
    const nav = getDesktopNav();
    const nextLinks = within(nav).getAllByTestId('next-link');
    expect(nextLinks).toHaveLength(6);
  });

  it('produces consistent className output for same pathname across renders', () => {
    mockUsePathname.mockReturnValue('/dashboard/optimization');
    const { container: firstRender } = render(
      <RoleProvider><SidebarNav /></RoleProvider>,
    );
    const firstHTML = firstRender.innerHTML;

    const { container: secondRender } = render(
      <RoleProvider><SidebarNav /></RoleProvider>,
    );
    const secondHTML = secondRender.innerHTML;

    expect(firstHTML).toBe(secondHTML);
  });
});

describe('SidebarNav — role-based filtering', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/dashboard');
  });

  it('shows all seven links for admin role', () => {
    jest.spyOn(require('@/lib/hooks/use-role'), 'useRole').mockReturnValue({
      role: 'admin',
      setRole: jest.fn(),
    });

    render(
      <RoleProvider>
        <SidebarNav />
      </RoleProvider>,
    );

    const nav = getDesktopNav();
    const links = within(nav).getAllByRole('link');
    expect(links).toHaveLength(7);
    expect(within(nav).getByText('Teams')).toBeInTheDocument();

    jest.restoreAllMocks();
  });

  it('shows all links for manager role', () => {
    jest.spyOn(require('@/lib/hooks/use-role'), 'useRole').mockReturnValue({
      role: 'manager',
      setRole: jest.fn(),
    });

    render(
      <RoleProvider>
        <SidebarNav />
      </RoleProvider>,
    );

    const nav = getDesktopNav();
    const links = within(nav).getAllByRole('link');
    expect(links).toHaveLength(7);

    jest.restoreAllMocks();
  });
});
