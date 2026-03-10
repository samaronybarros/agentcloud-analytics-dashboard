import { canAccessPage, canSeeSection, getAccessiblePages } from '@/lib/role-visibility';
import type { UserRole } from '@/lib/types';

describe('role-visibility', () => {
  // -------------------------------------------------------------------------
  // Page access
  // -------------------------------------------------------------------------

  describe('canAccessPage', () => {
    const allPages = [
      'overview',
      'agents',
      'teams',
      'models',
      'optimization',
      'alerts',
      'troubleshooting',
    ] as const;

    it('admin can access all pages', () => {
      for (const page of allPages) {
        expect(canAccessPage('admin', page)).toBe(true);
      }
    });

    it('manager can access all pages', () => {
      for (const page of allPages) {
        expect(canAccessPage('manager', page)).toBe(true);
      }
    });

    it('engineer can access all pages except teams', () => {
      expect(canAccessPage('engineer', 'overview')).toBe(true);
      expect(canAccessPage('engineer', 'agents')).toBe(true);
      expect(canAccessPage('engineer', 'teams')).toBe(false);
      expect(canAccessPage('engineer', 'models')).toBe(true);
      expect(canAccessPage('engineer', 'optimization')).toBe(true);
      expect(canAccessPage('engineer', 'alerts')).toBe(true);
      expect(canAccessPage('engineer', 'troubleshooting')).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // Section visibility
  // -------------------------------------------------------------------------

  describe('canSeeSection', () => {
    describe('admin sees all sections', () => {
      const allSections = [
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
      ] as const;

      it.each(allSections)('can see %s', (section) => {
        expect(canSeeSection('admin', section)).toBe(true);
      });
    });

    describe('manager sees cost data but not cost-by-model', () => {
      it('can see cost KPIs', () => {
        expect(canSeeSection('manager', 'kpi-token-volume')).toBe(true);
        expect(canSeeSection('manager', 'kpi-estimated-cost')).toBe(true);
      });

      it('can see cost trend chart', () => {
        expect(canSeeSection('manager', 'chart-cost-trend')).toBe(true);
      });

      it('can see agent cost column and scatter', () => {
        expect(canSeeSection('manager', 'agent-cost-column')).toBe(true);
        expect(canSeeSection('manager', 'cost-reliability-scatter')).toBe(true);
      });

      it('cannot see cost-by-model chart (admin-only)', () => {
        expect(canSeeSection('manager', 'cost-by-model')).toBe(false);
      });

      it('cannot see model cost columns (admin-only)', () => {
        expect(canSeeSection('manager', 'model-cost-column')).toBe(false);
        expect(canSeeSection('manager', 'model-cost-per-token-column')).toBe(false);
      });

      it('can see top users and cost insights/alerts', () => {
        expect(canSeeSection('manager', 'top-users')).toBe(true);
        expect(canSeeSection('manager', 'cost-insights')).toBe(true);
        expect(canSeeSection('manager', 'cost-alerts')).toBe(true);
      });
    });

    describe('engineer sees no cost sections', () => {
      const costSections = [
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
      ] as const;

      it.each(costSections)('cannot see %s', (section) => {
        expect(canSeeSection('engineer', section)).toBe(false);
      });
    });
  });

  // -------------------------------------------------------------------------
  // Accessible pages list
  // -------------------------------------------------------------------------

  describe('getAccessiblePages', () => {
    it('returns all pages for admin in order', () => {
      expect(getAccessiblePages('admin')).toEqual([
        'overview',
        'agents',
        'teams',
        'models',
        'optimization',
        'alerts',
        'troubleshooting',
      ]);
    });

    it('returns all pages for manager in order', () => {
      expect(getAccessiblePages('manager')).toEqual([
        'overview',
        'agents',
        'teams',
        'models',
        'optimization',
        'alerts',
        'troubleshooting',
      ]);
    });

    it('returns pages without teams for engineer', () => {
      const pages = getAccessiblePages('engineer');
      expect(pages).toEqual([
        'overview',
        'agents',
        'models',
        'optimization',
        'alerts',
        'troubleshooting',
      ]);
      expect(pages).not.toContain('teams');
    });

    it('preserves display order', () => {
      const roles: UserRole[] = ['admin', 'manager', 'engineer'];
      for (const role of roles) {
        const pages = getAccessiblePages(role);
        const indexMap = new Map(pages.map((page, index) => [page, index]));
        if (indexMap.has('overview') && indexMap.has('agents')) {
          expect(indexMap.get('overview')!).toBeLessThan(indexMap.get('agents')!);
        }
      }
    });
  });
});
