'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'Agents', href: '/dashboard/agents' },
  { label: 'Teams', href: '/dashboard/teams' },
  { label: 'Models', href: '/dashboard/models' },
  { label: 'Optimization', href: '/dashboard/optimization' },
  { label: 'Alerts', href: '/dashboard/alerts' },
  { label: 'Troubleshooting', href: '/dashboard/troubleshooting' },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="w-56 shrink-0 border-r border-gray-200 bg-white px-4 py-6">
      <h1 className="mb-8 text-lg font-semibold tracking-tight">
        AgentCloud
      </h1>
      <ul className="space-y-1 text-sm">
        {navItems.map(({ label, href }) => {
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
