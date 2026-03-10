'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import { useRole } from '@/lib/hooks/use-role';
import { canAccessPage } from '@/lib/role-visibility';
import type { DashboardPage } from '@/lib/role-visibility';

const navItems: { label: string; href: string; page: DashboardPage }[] = [
  { label: 'Overview', href: '/dashboard', page: 'overview' },
  { label: 'Agents', href: '/dashboard/agents', page: 'agents' },
  { label: 'Teams', href: '/dashboard/teams', page: 'teams' },
  { label: 'Models', href: '/dashboard/models', page: 'models' },
  { label: 'Optimization', href: '/dashboard/optimization', page: 'optimization' },
  { label: 'Alerts', href: '/dashboard/alerts', page: 'alerts' },
  { label: 'Troubleshooting', href: '/dashboard/troubleshooting', page: 'troubleshooting' },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { role } = useRole();
  const [mobileOpen, setMobileOpen] = useState(false);

  const roleParam = searchParams.get('role');
  const buildHref = useCallback(
    (basePath: string) =>
      roleParam ? `${basePath}?role=${roleParam}` : basePath,
    [roleParam],
  );

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  const navContent = (
    <>
      <h1 className="mb-8 text-lg font-semibold tracking-tight">
        AgentCloud
      </h1>
      <ul className="space-y-1 text-sm">
        {navItems
          .filter(({ page }) => canAccessPage(role, page))
          .map(({ label, href }) => {
            const isActive =
              href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={buildHref(href)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`block rounded-md px-3 py-2 hover:bg-gray-100 ${
                    isActive
                      ? 'font-medium text-gray-900'
                      : 'text-gray-600'
                  }`}
                  onClick={closeMobile}
                >
                  {label}
                </Link>
              </li>
            );
          })}
      </ul>
    </>
  );

  return (
    <>
      {/* Mobile header bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center border-b border-gray-200 bg-white px-4 py-3 md:hidden">
        <button
          type="button"
          onClick={toggleMobile}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          className="rounded-md p-1.5 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
        <span className="ml-3 text-lg font-semibold tracking-tight">AgentCloud</span>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile sliding sidebar */}
      <nav
        aria-label="Dashboard navigation"
        className={`fixed top-0 left-0 z-50 h-full w-64 transform border-r border-gray-200 bg-white px-4 py-6 transition-transform duration-200 ease-in-out md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navContent}
      </nav>

      {/* Desktop sidebar */}
      <nav
        aria-label="Dashboard navigation"
        className="hidden w-56 shrink-0 border-r border-gray-200 bg-white px-4 py-6 md:block"
      >
        {navContent}
      </nav>
    </>
  );
}
