import { test, expect } from '@playwright/test';

test.describe('Role-based access control', () => {
  test('default role (engineer) hides Teams from navigation', async ({ page }) => {
    await page.goto('/dashboard');

    const nav = page.locator('nav');
    // Engineer cannot see Teams
    await expect(nav.getByRole('link', { name: 'Teams' })).toBeHidden();

    // Other pages should be visible
    await expect(nav.getByRole('link', { name: 'Overview' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Agents' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Models' })).toBeVisible();
  });

  test('admin role shows all 7 pages in navigation', async ({ page }) => {
    await page.goto('/dashboard?role=admin');

    const nav = page.locator('nav');
    const allPages = ['Overview', 'Agents', 'Teams', 'Models', 'Optimization', 'Alerts', 'Troubleshooting'];
    for (const pageName of allPages) {
      await expect(nav.getByRole('link', { name: pageName })).toBeVisible();
    }
  });

  test('engineer sees no cost KPIs on Overview', async ({ page }) => {
    await page.goto('/dashboard?role=engineer');

    // Non-cost KPIs should be visible
    await expect(page.getByText('Total Runs')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Success Rate')).toBeVisible();
    await expect(page.getByText('Avg Latency')).toBeVisible();

    // Cost KPI should not be visible
    await expect(page.getByText('Estimated Cost')).toBeHidden();
  });

  test('admin sees cost KPIs on Overview', async ({ page }) => {
    await page.goto('/dashboard?role=admin');

    await expect(page.getByText('Estimated Cost')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Total Runs')).toBeVisible();
    await expect(page.getByText('Success Rate')).toBeVisible();
  });

  test('Teams page returns data for admin', async ({ page }) => {
    await page.goto('/dashboard/teams?role=admin');
    await expect(page.getByRole('heading', { name: 'Teams' })).toBeVisible();
    await expect(page.getByText('Usage by Team')).toBeVisible({ timeout: 10000 });
  });

  test('Teams page shows restricted message for engineer', async ({ page }) => {
    await page.goto('/dashboard/teams?role=engineer');
    await expect(
      page.getByText('Team-level analytics are available to Org Admins and Engineering Managers.')
    ).toBeVisible({ timeout: 10000 });
  });
});
