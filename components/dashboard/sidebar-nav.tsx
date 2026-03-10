'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const { role } = useRole();

  return (
    <nav className="w-56 shrink-0 border-r border-gray-200 bg-white px-4 py-6">
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
                  href={href}
                  className={`block rounded-md px-3 py-2 hover:bg-gray-100 ${
                    isActive
                      ? 'font-medium text-gray-900'
                      : 'text-gray-600'
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
      </ul>
    </nav>
  );
}
