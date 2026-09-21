import { test, expect } from '@playwright/test';
test('offline-only registration and help-team contacts', async ({ page }) => {
  await page.goto('/participate');
  await expect(
    page.getByRole('heading', { name: 'Offline registration', exact: true }),
  ).toBeVisible();
  await expect(page.locator('main form')).toHaveCount(0);
  await page.getByRole('link', { name: 'Registration desk details', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Registration team', exact: true })).toBeVisible();
  await expect(page.locator('.team-contact')).toContainText('00000 00001');
  await expect(page.locator('.team-contact a[href^="tel:"]')).toHaveCount(0);
  await expect(page.locator('.dummy-note')).toContainText('dummy');
  await page.goto('/help-desk');
  await expect(page.locator('.help-team-card')).toHaveCount(5);
  await page.setViewportSize({ width: 320, height: 900 });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
});
test('campus map loads its local worker, supports keyboard popup and handles denied location', async ({
  page,
  context,
}) => {
  test.setTimeout(120000);
  await page.goto('/venue');
  const region = page.getByRole('region', { name: 'Interactive map of EGS Pillay Campus' });
  await region.scrollIntoViewIfNeeded();
  const pin = page.getByRole('button', { name: 'Show EGS Pillay Campus details' });
  await expect(pin).toBeVisible({ timeout: 45000 });
  await pin.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.campus-popup')).toBeVisible();
  await expect(page.locator('.campus-popup')).toContainText('Registration is offline only');
  await expect(page.locator('.campus-popup a[href*="google.com"]')).toHaveAttribute(
    'href',
    /10\.803727755112378.*79\.83338948965753/,
  );
  await page.getByRole('button', { name: 'Close popup', exact: true }).click();
  await expect(page.locator('.campus-popup')).toHaveCount(0);
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await page.getByRole('button', { name: 'Zoom out', exact: true }).click();
  await page.getByRole('button', { name: 'Recenter on campus' }).click();
  await page.getByRole('button', { name: 'Dark map' }).click();
  await expect(page.getByRole('button', { name: 'Dark map' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('button', { name: 'Dark map' }).click();
  await context.clearPermissions();
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: {
        getCurrentPosition: (
          _success: unknown,
          error: (e: { code: number; message: string }) => void,
        ) => error({ code: 1, message: 'Denied for test' }),
      },
    }),
  );
  await page.getByRole('button', { name: 'Find my location' }).click();
  await expect(page.locator('.map-feedback')).toContainText('denied or unavailable');
  await page.setViewportSize({ width: 375, height: 900 });
  await region.scrollIntoViewIfNeeded();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
  await page.screenshot({ path: 'test-results/venue-map-mobile.png', fullPage: true });
});
