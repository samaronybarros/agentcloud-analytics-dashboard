import React from 'react';
import { render, screen, within } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock('@/lib/hooks/use-date-range', () => ({
  DateRangeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@/lib/hooks/use-role', () => {
  const actual = jest.requireActual('@/lib/hooks/use-role');
  return {
    ...actual,
    useRole: () => ({ role: 'admin' }),
  };
});

jest.mock('@/components/dashboard/dashboard-header', () => ({
  DashboardHeader: () => null,
}));

jest.mock('next/link', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) =>
      React.createElement('a', { href, className }, children),
  };
});

import DashboardLayout from '@/app/dashboard/layout';
import { usePathname } from 'next/navigation';

const mockUsePathname = usePathname as jest.Mock;

/**
 * Helper: returns the desktop navigation element.
 * The responsive sidebar renders two <nav> elements (mobile + desktop).
 * In JSDOM both are present; the desktop nav is the last one.
 */
function getDesktopNav(): HTMLElement {
  const navs = screen.getAllByRole('navigation');
  return navs[navs.length - 1];
}

describe('DashboardLayout', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/dashboard');
  });

  it('renders the AgentCloud brand name', () => {
    render(
      <DashboardLayout>
        <p>Page content</p>
      </DashboardLayout>,
    );
    const brandElements = screen.getAllByText('AgentCloud');
    expect(brandElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders brand as a heading', () => {
    render(
      <DashboardLayout>
        <p>Content</p>
      </DashboardLayout>,
    );
    const headings = screen.getAllByRole('heading', { name: 'AgentCloud' });
    expect(headings.length).toBeGreaterThanOrEqual(1);
  });

  it('renders all seven navigation links', () => {
    render(
      <DashboardLayout>
        <p>Content</p>
      </DashboardLayout>,
    );
    const nav = getDesktopNav();
    expect(within(nav).getByText('Overview')).toBeInTheDocument();
    expect(within(nav).getByText('Agents')).toBeInTheDocument();
    expect(within(nav).getByText('Teams')).toBeInTheDocument();
    expect(within(nav).getByText('Models')).toBeInTheDocument();
    expect(within(nav).getByText('Optimization')).toBeInTheDocument();
    expect(within(nav).getByText('Alerts')).toBeInTheDocument();
    expect(within(nav).getByText('Troubleshooting')).toBeInTheDocument();
  });

  it('renders exactly seven navigation links', () => {
    render(
      <DashboardLayout>
        <p>Content</p>
      </DashboardLayout>,
    );
    const nav = getDesktopNav();
    const links = within(nav).getAllByRole('link');
    expect(links).toHaveLength(7);
  });

  it('links point to correct paths', () => {
    render(
      <DashboardLayout>
        <p>Content</p>
      </DashboardLayout>,
    );
    const nav = getDesktopNav();
    expect(within(nav).getByText('Overview').closest('a')).toHaveAttribute('href', '/dashboard');
    expect(within(nav).getByText('Agents').closest('a')).toHaveAttribute('href', '/dashboard/agents');
    expect(within(nav).getByText('Teams').closest('a')).toHaveAttribute('href', '/dashboard/teams');
    expect(within(nav).getByText('Models').closest('a')).toHaveAttribute('href', '/dashboard/models');
    expect(within(nav).getByText('Optimization').closest('a')).toHaveAttribute('href', '/dashboard/optimization');
    expect(within(nav).getByText('Alerts').closest('a')).toHaveAttribute('href', '/dashboard/alerts');
    expect(within(nav).getByText('Troubleshooting').closest('a')).toHaveAttribute('href', '/dashboard/troubleshooting');
  });

  it('navigation links are inside the nav element', () => {
    render(
      <DashboardLayout>
        <p>Content</p>
      </DashboardLayout>,
    );
    const nav = getDesktopNav();
    expect(within(nav).getByText('Overview')).toBeInTheDocument();
    expect(within(nav).getByText('Agents')).toBeInTheDocument();
    expect(within(nav).getByText('Teams')).toBeInTheDocument();
    expect(within(nav).getByText('Models')).toBeInTheDocument();
    expect(within(nav).getByText('Optimization')).toBeInTheDocument();
    expect(within(nav).getByText('Alerts')).toBeInTheDocument();
    expect(within(nav).getByText('Troubleshooting')).toBeInTheDocument();
  });

  it('renders children in the main area', () => {
    render(
      <DashboardLayout>
        <p data-testid="page-content">Hello</p>
      </DashboardLayout>,
    );
    expect(screen.getByTestId('page-content')).toBeInTheDocument();
  });

  it('children are rendered inside the main element', () => {
    render(
      <DashboardLayout>
        <p data-testid="child-el">Inside main</p>
      </DashboardLayout>,
    );
    const main = screen.getByRole('main');
    expect(within(main).getByTestId('child-el')).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    render(
      <DashboardLayout>
        <p data-testid="child-a">A</p>
        <p data-testid="child-b">B</p>
      </DashboardLayout>,
    );
    expect(screen.getByTestId('child-a')).toBeInTheDocument();
    expect(screen.getByTestId('child-b')).toBeInTheDocument();
  });

  it('has a nav element for accessibility', () => {
    render(
      <DashboardLayout>
        <p>Content</p>
      </DashboardLayout>,
    );
    const navs = screen.getAllByRole('navigation');
    expect(navs.length).toBeGreaterThanOrEqual(1);
  });

  it('has a main element for content', () => {
    render(
      <DashboardLayout>
        <p>Content</p>
      </DashboardLayout>,
    );
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('navigation links are rendered as list items', () => {
    render(
      <DashboardLayout>
        <p>Content</p>
      </DashboardLayout>,
    );
    const nav = getDesktopNav();
    const listItems = within(nav).getAllByRole('listitem');
    expect(listItems).toHaveLength(7);
  });

  it('nav and main are sibling sections of the layout', () => {
    render(
      <DashboardLayout>
        <p>Content</p>
      </DashboardLayout>,
    );
    const nav = getDesktopNav();
    const main = screen.getByRole('main');
    // The desktop nav and main share the same flex container parent
    expect(nav.parentElement).toBe(main.parentElement);
  });

  describe('hydration safety', () => {
    it('layout produces identical markup regardless of pathname', () => {
      mockUsePathname.mockReturnValue('/dashboard');
      const { container: containerA } = render(
        <DashboardLayout>
          <p>Content</p>
        </DashboardLayout>,
      );

      mockUsePathname.mockReturnValue('/dashboard/agents');
      const { container: containerB } = render(
        <DashboardLayout>
          <p>Content</p>
        </DashboardLayout>,
      );

      const mainA = containerA.querySelector('main')!.innerHTML;
      const mainB = containerB.querySelector('main')!.innerHTML;
      expect(mainA).toBe(mainB);
    });

    it('layout does not use usePathname directly', () => {
      // The layout module should not import usePathname — that belongs in SidebarNav.
      // If the layout called usePathname, it would need 'use client', risking hydration mismatches.
      const layoutSource = require('fs').readFileSync(
        require('path').resolve(__dirname, '../../../../app/dashboard/layout.tsx'),
        'utf-8',
      );
      expect(layoutSource).not.toContain('usePathname');
      expect(layoutSource).not.toContain("'use client'");
    });
  });

  describe('active navigation highlighting', () => {
    it('highlights Overview when on /dashboard', () => {
      mockUsePathname.mockReturnValue('/dashboard');
      render(
        <DashboardLayout>
          <p>Content</p>
        </DashboardLayout>,
      );
      const nav = getDesktopNav();
      const overviewLink = within(nav).getByText('Overview').closest('a')!;
      expect(overviewLink.className).toContain('text-gray-900');
      expect(overviewLink.className).toContain('font-medium');
    });

    it('does not highlight other links when on /dashboard', () => {
      mockUsePathname.mockReturnValue('/dashboard');
      render(
        <DashboardLayout>
          <p>Content</p>
        </DashboardLayout>,
      );
      const nav = getDesktopNav();
      const agentsLink = within(nav).getByText('Agents').closest('a')!;
      const teamsLink = within(nav).getByText('Teams').closest('a')!;
      const optimizationLink = within(nav).getByText('Optimization').closest('a')!;
      expect(agentsLink.className).toContain('text-gray-600');
      expect(teamsLink.className).toContain('text-gray-600');
      expect(optimizationLink.className).toContain('text-gray-600');
    });

    it('highlights Agents when on /dashboard/agents', () => {
      mockUsePathname.mockReturnValue('/dashboard/agents');
      render(
        <DashboardLayout>
          <p>Content</p>
        </DashboardLayout>,
      );
      const nav = getDesktopNav();
      const agentsLink = within(nav).getByText('Agents').closest('a')!;
      expect(agentsLink.className).toContain('text-gray-900');
      expect(agentsLink.className).toContain('font-medium');
    });

    it('highlights Teams when on /dashboard/teams', () => {
      mockUsePathname.mockReturnValue('/dashboard/teams');
      render(
        <DashboardLayout>
          <p>Content</p>
        </DashboardLayout>,
      );
      const nav = getDesktopNav();
      const teamsLink = within(nav).getByText('Teams').closest('a')!;
      expect(teamsLink.className).toContain('text-gray-900');
      expect(teamsLink.className).toContain('font-medium');
    });

    it('highlights Optimization when on /dashboard/optimization', () => {
      mockUsePathname.mockReturnValue('/dashboard/optimization');
      render(
        <DashboardLayout>
          <p>Content</p>
        </DashboardLayout>,
      );
      const nav = getDesktopNav();
      const optimizationLink = within(nav).getByText('Optimization').closest('a')!;
      expect(optimizationLink.className).toContain('text-gray-900');
      expect(optimizationLink.className).toContain('font-medium');
    });

    it('only one link is active at a time', () => {
      mockUsePathname.mockReturnValue('/dashboard/teams');
      render(
        <DashboardLayout>
          <p>Content</p>
        </DashboardLayout>,
      );
      const nav = getDesktopNav();
      const links = within(nav).getAllByRole('link');
      const activeLinks = links.filter((link) => link.className.includes('text-gray-900'));
      expect(activeLinks).toHaveLength(1);
      expect(activeLinks[0]).toHaveTextContent('Teams');
    });
  });
});
