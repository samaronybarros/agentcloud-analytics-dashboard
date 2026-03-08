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
      React.createElement('a', { href, className }, children),
  };
});

import DashboardLayout from '@/app/dashboard/layout';
import { usePathname } from 'next/navigation';

const mockUsePathname = usePathname as jest.Mock;

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
    expect(screen.getByText('AgentCloud')).toBeInTheDocument();
  });

  it('renders brand as a heading', () => {
    render(
      <DashboardLayout>
        <p>Content</p>
      </DashboardLayout>,
    );
    expect(screen.getByRole('heading', { name: 'AgentCloud' })).toBeInTheDocument();
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

  it('renders exactly four navigation links', () => {
    render(
      <DashboardLayout>
        <p>Content</p>
      </DashboardLayout>,
    );
    const nav = screen.getByRole('navigation');
    const links = within(nav).getAllByRole('link');
    expect(links).toHaveLength(4);
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

  it('navigation links are inside the nav element', () => {
    render(
      <DashboardLayout>
        <p>Content</p>
      </DashboardLayout>,
    );
    const nav = screen.getByRole('navigation');
    expect(within(nav).getByText('Overview')).toBeInTheDocument();
    expect(within(nav).getByText('Agents')).toBeInTheDocument();
    expect(within(nav).getByText('Teams')).toBeInTheDocument();
    expect(within(nav).getByText('Optimization')).toBeInTheDocument();
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

  it('navigation links are rendered as list items', () => {
    render(
      <DashboardLayout>
        <p>Content</p>
      </DashboardLayout>,
    );
    const nav = screen.getByRole('navigation');
    const listItems = within(nav).getAllByRole('listitem');
    expect(listItems).toHaveLength(4);
  });

  it('nav and main are sibling sections of the layout', () => {
    render(
      <DashboardLayout>
        <p>Content</p>
      </DashboardLayout>,
    );
    const nav = screen.getByRole('navigation');
    const main = screen.getByRole('main');
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
      const overviewLink = screen.getByText('Overview').closest('a')!;
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
      const agentsLink = screen.getByText('Agents').closest('a')!;
      const teamsLink = screen.getByText('Teams').closest('a')!;
      const optimizationLink = screen.getByText('Optimization').closest('a')!;
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
      const agentsLink = screen.getByText('Agents').closest('a')!;
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
      const teamsLink = screen.getByText('Teams').closest('a')!;
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
      const optimizationLink = screen.getByText('Optimization').closest('a')!;
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
      const nav = screen.getByRole('navigation');
      const links = within(nav).getAllByRole('link');
      const activeLinks = links.filter((link) => link.className.includes('text-gray-900'));
      expect(activeLinks).toHaveLength(1);
      expect(activeLinks[0]).toHaveTextContent('Teams');
    });
  });
});
