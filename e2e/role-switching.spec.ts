import { test, expect } from '@playwright/test';

test.describe('Role-based access control', () => {
  test('default role is admin with all pages visible', async ({ page }) => {
    await page.goto('/dashboard');

    const roleSelector = page.locator('#role-selector');
    await expect(roleSelector).toHaveValue('admin');

    // All 7 nav items should be visible for admin
    const nav = page.locator('nav');
    const allPages = ['Overview', 'Agents', 'Teams', 'Models', 'Optimization', 'Alerts', 'Troubleshooting'];
    for (const pageName of allPages) {
      await expect(nav.getByRole('link', { name: pageName })).toBeVisible();
    }
  });

  test('engineer role hides Teams page from navigation', async ({ page }) => {
    await page.goto('/dashboard');

    const roleSelector = page.locator('#role-selector');
    await roleSelector.selectOption('engineer');

    const nav = page.locator('nav');
    // Teams should not be visible for engineer
    await expect(nav.getByRole('link', { name: 'Teams' })).toBeHidden();

    // Other pages should still be visible
    await expect(nav.getByRole('link', { name: 'Overview' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Agents' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Models' })).toBeVisible();
  });

  test('Teams page shows restricted message for engineer', async ({ page }) => {
    // Navigate to Teams page as admin first
    await page.goto('/dashboard/teams');
    await expect(page.getByRole('heading', { name: 'Teams' })).toBeVisible();

    // Wait for Teams data to load (admin should see content)
    await expect(page.getByText('Usage by Team')).toBeVisible({ timeout: 10000 });

    // Switch to engineer role
    const roleSelector = page.locator('#role-selector');
    await roleSelector.selectOption('engineer');

    // Should see restricted access message
    await expect(
      page.getByText('Team-level analytics are available to Org Admins and Engineering Managers.')
    ).toBeVisible();
  });

  test('switching back to admin restores Teams data', async ({ page }) => {
    await page.goto('/dashboard/teams');

    // Switch to engineer
    const roleSelector = page.locator('#role-selector');
    await roleSelector.selectOption('engineer');

    // Verify restricted message appears
    await expect(
      page.getByText('Team-level analytics are available to Org Admins and Engineering Managers.')
    ).toBeVisible();

    // Switch back to admin
    await roleSelector.selectOption('admin');

    // Teams data should load again
    await expect(page.getByText('Usage by Team')).toBeVisible({ timeout: 10000 });
  });

  test('cost KPIs disappear on Overview when switching to engineer', async ({ page }) => {
    await page.goto('/dashboard');

    // Wait for overview data to load as admin
    await expect(page.getByText('Estimated Cost')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Token Volume')).toBeVisible();

    // Switch to engineer
    const roleSelector = page.locator('#role-selector');
    await roleSelector.selectOption('engineer');

    // Cost KPIs should be hidden for engineer
    await expect(page.getByText('Estimated Cost')).toBeHidden();
    await expect(page.getByText('Token Volume')).toBeHidden();

    // Non-cost KPIs should still be visible
    await expect(page.getByText('Total Runs')).toBeVisible();
    await expect(page.getByText('Success Rate')).toBeVisible();
    await expect(page.getByText('Avg Latency')).toBeVisible();
  });
});
