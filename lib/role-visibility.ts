// ---------------------------------------------------------------------------
// Role-based visibility configuration
// ---------------------------------------------------------------------------
// Sections are nested under the page they belong to. Each role declares which
// pages it can access and, within each page, which sections are visible.
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
  // Teams
  | 'cost-by-model'
  | 'top-users'
  // Models
  | 'model-cost-column'
  | 'model-cost-per-token-column'
  // Optimization
  | 'cost-insights'
  // Alerts
  | 'cost-alerts';

// ---------------------------------------------------------------------------
// Page → section mapping (single source of truth for ownership)
// ---------------------------------------------------------------------------

const PAGE_SECTIONS: Record<DashboardPage, readonly DashboardSection[]> = {
  overview: ['kpi-token-volume', 'kpi-estimated-cost', 'chart-cost-trend'],
  agents: ['agent-cost-column', 'cost-reliability-scatter'],
  teams: ['cost-by-model', 'top-users'],
  models: ['model-cost-column', 'model-cost-per-token-column'],
  optimization: ['cost-insights'],
  alerts: ['cost-alerts'],
  troubleshooting: [],
};

// ---------------------------------------------------------------------------
// Ordered page list (defines nav ordering)
// ---------------------------------------------------------------------------

const PAGES_ORDERED: readonly DashboardPage[] = [
  'overview',
  'agents',
  'teams',
  'models',
  'optimization',
  'alerts',
  'troubleshooting',
];

// ---------------------------------------------------------------------------
// Per-role visibility: which pages and which sections within each page
// ---------------------------------------------------------------------------

type PageVisibility = {
  /** Which sections within this page are visible. `'all'` = every section. */
  sections: readonly DashboardSection[] | 'all';
};

type RoleConfig = Partial<Record<DashboardPage, PageVisibility>>;

/**
 * Build a role config that grants access to every page with all sections.
 * Callers can override individual pages or omit pages to deny access.
 */
function allPages(): RoleConfig {
  const config: RoleConfig = {};
  for (const page of PAGES_ORDERED) {
    config[page] = { sections: 'all' };
  }
  return config;
}

const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  // Admin: full access to every page and section
  admin: allPages(),

  // Manager: all pages, but no cost-by-model or model cost columns (admin-only)
  manager: {
    overview: { sections: 'all' },
    agents: { sections: 'all' },
    teams: { sections: ['top-users'] },
    models: { sections: [] },
    optimization: { sections: 'all' },
    alerts: { sections: 'all' },
    troubleshooting: { sections: 'all' },
  },

  // Engineer: no Teams page, no cost-sensitive sections anywhere
  engineer: {
    overview: { sections: [] },
    agents: { sections: [] },
    // teams: omitted → no access
    models: { sections: [] },
    optimization: { sections: [] },
    alerts: { sections: [] },
    troubleshooting: { sections: [] },
  },
};

// ---------------------------------------------------------------------------
// Derived lookup sets (computed once at module load)
// ---------------------------------------------------------------------------

interface ResolvedVisibility {
  pages: ReadonlySet<DashboardPage>;
  sections: ReadonlySet<DashboardSection>;
}

function resolve(config: RoleConfig): ResolvedVisibility {
  const pages = new Set<DashboardPage>();
  const sections = new Set<DashboardSection>();

  for (const page of PAGES_ORDERED) {
    const entry = config[page];
    if (!entry) continue;

    pages.add(page);

    if (entry.sections === 'all') {
      for (const section of PAGE_SECTIONS[page]) {
        sections.add(section);
      }
    } else {
      for (const section of entry.sections) {
        sections.add(section);
      }
    }
  }

  return { pages, sections };
}

const RESOLVED: Record<UserRole, ResolvedVisibility> = {
  admin: resolve(ROLE_CONFIGS.admin),
  manager: resolve(ROLE_CONFIGS.manager),
  engineer: resolve(ROLE_CONFIGS.engineer),
};

// ---------------------------------------------------------------------------
// Public API (unchanged)
// ---------------------------------------------------------------------------

/** Check whether a role can access a given page */
export function canAccessPage(role: UserRole, page: DashboardPage): boolean {
  return RESOLVED[role].pages.has(page);
}

/** Check whether a role can see a given section/element */
export function canSeeSection(role: UserRole, section: DashboardSection): boolean {
  return RESOLVED[role].sections.has(section);
}

/** Get the list of accessible pages for a role (ordered) */
export function getAccessiblePages(role: UserRole): DashboardPage[] {
  return PAGES_ORDERED.filter((page) => RESOLVED[role].pages.has(page));
}
