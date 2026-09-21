import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = [
  '/',
  '/about',
  '/experience',
  '/themes',
  '/projects',
  '/schedule',
  '/participate',
  '/updates',
  '/gallery',
  '/venue',
  '/faq',
  '/contact',
  '/help-desk',
  '/help-desk/registration',
  '/help-desk/food-accommodation',
  '/help-desk/venue-support',
  '/help-desk/technical-support',
  '/help-desk/visitor-accessibility',
];
test('all public pages, local assets and linked routes respond successfully', async ({
  page,
  request,
}) => {
  const links = new Set<string>();
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator('main h1')).toHaveCount(1);
    for (const href of await page
      .locator('a[href^="/"]')
      .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('href')!)))
      links.add(href.split('#')[0]);
    for (const image of await page.locator('img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          image.evaluate(
            (n) => (n as HTMLImageElement).complete && (n as HTMLImageElement).naturalWidth > 0,
          ),
        )
        .toBeTruthy();
    }
  }
  for (const href of links) expect((await request.get(href)).status(), href).toBe(200);
  for (const path of [
    '/sitemap.xml',
    '/robots.txt',
    '/icon.svg',
    '/opengraph-image',
    '/downloads/exhibitor-guidelines.txt',
  ])
    expect((await request.get(path)).status(), path).toBe(200);
  expect((await request.get('/projects/missing-project')).status()).toBe(404);
  expect((await request.get('/updates/missing-update')).status()).toBe(404);
});
test('project search, category deep links, empty results and reset', async ({ page }) => {
  await page.goto('/projects?category=Robotics');
  await expect(page.getByLabel('Science track')).toHaveValue('Robotics');
  await expect(page.locator('.project-card')).toHaveCount(1);
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('.project-card')).toHaveCount(6);
  await page.getByLabel('Search exhibits').fill('satellite');
  await expect(page.locator('.project-card')).toHaveCount(1);
  await page.getByLabel('Search exhibits').fill('unmatched-example');
  await expect(page.getByRole('heading', { name: 'No exhibits found' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await page.getByLabel('Science track').selectOption('Space');
  await expect(page.getByRole('status')).toContainText('0 projects in Space');
});
test('gallery filters and contact validation are functional and honest', async ({ page }) => {
  await page.goto('/gallery');
  await page.getByRole('button', { name: 'Awards', exact: true }).click();
  await expect(page.locator('figure')).toHaveCount(1);
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await expect(page.locator('figure')).toHaveCount(6);
  await page.goto('/contact');
  await page.getByRole('button', { name: 'Check enquiry' }).click();
  await expect(page.getByLabel('Name', { exact: true })).toBeFocused();
  await expect(page.locator('[aria-invalid=true]')).toHaveCount(4);
  await page.getByLabel('Name', { exact: true }).fill('Student Visitor');
  await page.getByLabel('Email', { exact: true }).fill('student@example.org');
  await page.getByLabel('Subject', { exact: true }).selectOption('Visitor information');
  await page
    .getByLabel('Message', { exact: true })
    .fill('I would like to learn about the proposed visitor arrangements.');
  await page.getByRole('button', { name: 'Check enquiry' }).click();
  await expect(page.getByRole('status')).toContainText('has not been sent');
});
test('keyboard navigation, dropdown dismissal and FAQ disclosure', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  const explore = page.locator('.explore-menu summary');
  await explore.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.dropdown')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.dropdown')).toBeHidden();
  await expect(explore).toBeFocused();
  await page.goto('/faq');
  const first = page.locator('.faq-list summary').first();
  await first.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.faq-list details').first()).toHaveAttribute('open', '');
});
test('responsive layouts, mobile menu and reduced motion', async ({ page }) => {
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ['/', '/projects', '/schedule', '/participate', '/contact']) {
      await page.goto(route);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `${route} at ${width}`,
      ).toBeTruthy();
    }
    await page.goto('/');
    await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true });
    await page.screenshot({ path: `test-results/hero-${width}.png` });
  }
  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeFocused();
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: 'Projects & exhibits' })
    .click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeHidden();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe(
    'auto',
  );
});
test('automated WCAG A/AA accessibility checks', async ({ page }) => {
  for (const route of routes) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(
      results.violations,
      `${route}: ${JSON.stringify(results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })))}`,
    ).toEqual([]);
  }
});
