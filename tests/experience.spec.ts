import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('science experiments, motion preference and official logo work across screen sizes', async ({
  page,
}) => {
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.text().includes('graphics initialization')) console.log(message.text());
  });
  await page.goto('/experience');
  await expect(page.locator('.institution-logo')).toHaveAttribute(
    'src',
    '/egs-pillay-group-logo-flat-dark.svg',
  );
  await expect(page.locator('.institution-logo')).toBeVisible();
  await page.getByRole('button', { name: /01 \/ Satellite/ }).click();
  await page.getByRole('button', { name: 'Send signal', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Message received' })).toBeVisible();
  await page.getByLabel('Ground station position').fill('40');
  await expect(page.getByLabel('Ground station position')).toHaveValue('40');
  await page.getByRole('button', { name: 'Reset signal' }).click();
  await expect(page.getByLabel('Ground station position')).toHaveValue('0');
  for (const name of [/02 \/ Space/, /03 \/ Aerodynamics/]) {
    await page.getByRole('button', { name }).click();
    await expect(
      page.getByLabel(name.source.includes('Space') ? 'Orbital inclination' : 'Wing angle'),
    ).toBeVisible();
    await expect(page.locator('.experiment-panel')).toHaveCSS('opacity', '1');
    await expect(page.locator('.webgl-stage canvas')).toBeVisible();
    await expect(page.locator('.webgl-fallback')).toHaveCount(0);
    await page.getByRole('button', { name: 'Play experiment', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Pause experiment' })).toBeVisible();
    await page.getByRole('slider').fill('15');
    await page.getByRole('button', { name: 'Pause experiment' }).click();
    await page.screenshot({
      path: name.source.includes('Space') ? 'test-results/orbit.png' : 'test-results/airflow.png',
    });
  }
  await page.getByRole('button', { name: 'Reduce motion: off' }).click();
  await expect(page.getByRole('button', { name: 'Play experiment' })).toBeDisabled();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Reduce motion: on' })).toBeVisible();
  await page.getByRole('button', { name: /01 \/ Satellite/ }).click();
  await page.getByRole('button', { name: 'Send signal', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Message received' })).toBeVisible();
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      String(width),
    ).toBe(true);
  }
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(result.violations).toEqual([]);
  expect(errors).toEqual([]);
});

test('operating system reduced motion cannot be overridden', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/experience');
  await expect(page.getByRole('button', { name: 'Reduce motion: on' })).toBeVisible();
  await page.getByRole('button', { name: 'Reduce motion: on' }).click();
  await expect(page.getByRole('button', { name: 'Reduce motion: on' })).toBeVisible();
  await page.getByRole('button', { name: /02 \/ Space/ }).click();
  await expect(page.getByRole('button', { name: 'Play experiment' })).toBeDisabled();
});
