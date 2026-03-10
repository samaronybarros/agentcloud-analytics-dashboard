import { test, expect } from '@playwright/test';

test.describe('API error handling', () => {
  test('displays error state when overview API returns 500', async ({ page }) => {
    // Intercept the overview API call and return a 500 error
    await page.route('**/api/analytics/overview*', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    await page.goto('/dashboard');

    // Wait for the error state to appear
    await expect(page.getByTestId('error-state')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Something went wrong while loading data.')).toBeVisible();
  });

  test('displays error state when trends API returns 500', async ({ page }) => {
    // Intercept the trends API call and return a 500 error
    await page.route('**/api/analytics/trends*', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    await page.goto('/dashboard');

    // The error state should appear since trends failed
    await expect(page.getByTestId('error-state')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Something went wrong while loading data.')).toBeVisible();
  });

  test('displays error state when agents API returns 500', async ({ page }) => {
    await page.route('**/api/analytics/agents*', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    await page.goto('/dashboard/agents');

    await expect(page.getByTestId('error-state')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Something went wrong while loading data.')).toBeVisible();
  });

  test('error state shows refresh hint', async ({ page }) => {
    await page.route('**/api/analytics/overview*', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    await page.goto('/dashboard');

    await expect(page.getByTestId('error-state')).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByText('Try refreshing the page or selecting a different date range.')
    ).toBeVisible();
  });
});
