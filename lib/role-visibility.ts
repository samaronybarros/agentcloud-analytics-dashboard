// ---------------------------------------------------------------------------
// Role-based visibility configuration
// ---------------------------------------------------------------------------
// Defines what each user role can see across the dashboard.
// Cost-sensitive data is restricted to admin and manager roles.
// The Teams page (cross-org cost breakdowns) is hidden from engineers.
// ---------------------------------------------------------------------------

import type { UserRole } from '@/lib/types';

/** Dashboard page identifiers matching nav routes */
export type DashboardPage =
  | 'overview'
  | 'agents'
  | 'teams'
  | 'models'
  | 'optimization'
  | 'alerts'
  | 'troubleshooting';

/** Sections within pages that can be individually hidden */
export type DashboardSection =
  // Overview
  | 'kpi-token-volume'
  | 'kpi-estimated-cost'
  | 'chart-cost-trend'
  // Agents
  | 'agent-cost-column'
  | 'cost-reliability-scatter'
  // Teams (entire page hidden for engineer, but sections for manager)
  | 'cost-by-model'
  | 'top-users'
  // Models
  | 'model-cost-column'
  | 'model-cost-per-token-column'
  // Optimization
  | 'cost-insights'
  // Alerts
  | 'cost-alerts';

interface RoleVisibility {
  pages: ReadonlySet<DashboardPage>;
  sections: ReadonlySet<DashboardSection>;
}

const ALL_PAGES: ReadonlySet<DashboardPage> = new Set([
  'overview',
  'agents',
  'teams',
  'models',
  'optimization',
  'alerts',
  'troubleshooting',
]);

const ALL_SECTIONS: ReadonlySet<DashboardSection> = new Set([
  'kpi-token-volume',
  'kpi-estimated-cost',
  'chart-cost-trend',
  'agent-cost-column',
  'cost-reliability-scatter',
  'cost-by-model',
  'top-users',
  'model-cost-column',
  'model-cost-per-token-column',
  'cost-insights',
  'cost-alerts',
]);

/** Admin sees everything */
const ADMIN_VISIBILITY: RoleVisibility = {
  pages: ALL_PAGES,
  sections: ALL_SECTIONS,
};

/** Manager sees everything (team-scoped where applicable) */
const MANAGER_VISIBILITY: RoleVisibility = {
  pages: ALL_PAGES,
  sections: new Set<DashboardSection>([
    'kpi-token-volume',
    'kpi-estimated-cost',
    'chart-cost-trend',
    'agent-cost-column',
    'cost-reliability-scatter',
    'top-users',
    'cost-insights',
    'cost-alerts',
  ]),
};

/** Engineer sees reliability/performance — no cost data, no Teams page */
const ENGINEER_VISIBILITY: RoleVisibility = {
  pages: new Set<DashboardPage>([
    'overview',
    'agents',
    'models',
    'optimization',
    'alerts',
    'troubleshooting',
  ]),
  sections: new Set<DashboardSection>([]),
};

const VISIBILITY_MAP: Record<UserRole, RoleVisibility> = {
  admin: ADMIN_VISIBILITY,
  manager: MANAGER_VISIBILITY,
  engineer: ENGINEER_VISIBILITY,
};

/** Check whether a role can access a given page */
export function canAccessPage(role: UserRole, page: DashboardPage): boolean {
  return VISIBILITY_MAP[role].pages.has(page);
}

/** Check whether a role can see a given section/element */
export function canSeeSection(role: UserRole, section: DashboardSection): boolean {
  return VISIBILITY_MAP[role].sections.has(section);
}

/** Get the list of accessible pages for a role (ordered) */
export function getAccessiblePages(role: UserRole): DashboardPage[] {
  const allOrdered: DashboardPage[] = [
    'overview',
    'agents',
    'teams',
    'models',
    'optimization',
    'alerts',
    'troubleshooting',
  ];
  return allOrdered.filter((page) => VISIBILITY_MAP[role].pages.has(page));
}
