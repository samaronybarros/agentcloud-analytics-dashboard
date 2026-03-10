import { test, expect } from '@playwright/test';

test.describe('Dashboard smoke tests', () => {
  test('loads the Overview page with heading', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
  });

  test('displays all 7 sidebar navigation items for admin', async ({ page }) => {
    await page.goto('/dashboard?role=admin');

    const nav = page.locator('nav');
    const expectedItems = [
      'Overview',
      'Agents',
      'Teams',
      'Models',
      'Optimization',
      'Alerts',
      'Troubleshooting',
    ];

    for (const itemName of expectedItems) {
      await expect(nav.getByRole('link', { name: itemName })).toBeVisible();
    }
  });

  test.describe('page navigation', () => {
    const pages = [
      { name: 'Overview', path: '/dashboard?role=admin', heading: 'Overview' },
      { name: 'Agents', path: '/dashboard/agents?role=admin', heading: 'Agents' },
      { name: 'Teams', path: '/dashboard/teams?role=admin', heading: 'Teams' },
      { name: 'Models', path: '/dashboard/models?role=admin', heading: 'Models' },
      { name: 'Optimization', path: '/dashboard/optimization?role=admin', heading: 'Optimization' },
      { name: 'Alerts', path: '/dashboard/alerts?role=admin', heading: 'Alerts' },
      { name: 'Troubleshooting', path: '/dashboard/troubleshooting?role=admin', heading: 'Troubleshooting' },
    ];

    for (const { name, path, heading } of pages) {
      test(`navigates to ${name} page and shows heading`, async ({ page }) => {
        await page.goto(path);
        await expect(page.getByRole('heading', { name: heading })).toBeVisible();
      });
    }
  });

  test('date range picker is visible and functional', async ({ page }) => {
    await page.goto('/dashboard');

    const dateRangeSelect = page.locator('#date-range');
    await expect(dateRangeSelect).toBeVisible();

    // Verify default value is 'all' (all time)
    await expect(dateRangeSelect).toHaveValue('all');

    // Change to 7d and verify
    await dateRangeSelect.selectOption('7d');
    await expect(dateRangeSelect).toHaveValue('7d');

    // Change to 14d and verify
    await dateRangeSelect.selectOption('14d');
    await expect(dateRangeSelect).toHaveValue('14d');

    // Change to 30d
    await dateRangeSelect.selectOption('30d');
    await expect(dateRangeSelect).toHaveValue('30d');
  });

  test('sidebar navigation links work when clicked', async ({ page }) => {
    await page.goto('/dashboard?role=admin');

    // Click on Agents in the sidebar
    const nav = page.locator('nav');
    await nav.getByRole('link', { name: 'Agents' }).click();
    await expect(page.getByRole('heading', { name: 'Agents' })).toBeVisible();

    // Click on Teams
    await nav.getByRole('link', { name: 'Teams' }).click();
    await expect(page.getByRole('heading', { name: 'Teams' })).toBeVisible();

    // Click back to Overview
    await nav.getByRole('link', { name: 'Overview' }).click();
    await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
  });
});
