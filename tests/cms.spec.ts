import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import { randomBytes, createHash } from 'node:crypto';
import { loadEnvFile } from 'node:process';
import sharp from 'sharp';
import AxeBuilder from '@axe-core/playwright';
loadEnvFile('.env.local');
const db = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const publicDb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const run = randomBytes(6).toString('hex');
const email = `expo-cms-test-${run}@example.org`;
const initialPassword = randomBytes(24).toString('base64url');
const password = randomBytes(24).toString('base64url');
let userId = '';
const documentIds: string[] = [];
const mediaIds: string[] = [];
test.beforeAll(async () => {
  const { data, error } = await db.auth.admin.createUser({
    email,
    password: initialPassword,
    email_confirm: true,
  });
  if (error || !data.user) throw new Error('Could not create isolated CMS test account.');
  userId = data.user.id;
  const result = await db
    .from('expo_cms_admins')
    .insert({ id: userId, email, must_change_password: true });
  if (result.error) throw new Error('Could not approve isolated CMS test account.');
});
test.afterAll(async () => {
  if (documentIds.length) {
    await db.from('expo_cms_documents').delete().in('id', documentIds);
  }
  if (mediaIds.length) await db.from('expo_cms_media').delete().in('id', mediaIds);
  await db.from('expo_cms_audit').delete().eq('actor', email);
  await db
    .from('expo_cms_login_attempts')
    .delete()
    .eq('bucket', createHash('sha256').update(email).digest('hex'));
  if (userId) await db.auth.admin.deleteUser(userId);
});
test('private APIs and Supabase public key cannot access CMS content', async ({ request }) => {
  for (const path of ['/api/admin/content/projects', '/api/admin/media', '/api/admin/export'])
    expect((await request.get(path)).status()).toBe(401);
  expect((await request.post('/api/admin/content/updates', { data: {} })).status()).toBe(401);
  const denied = await publicDb.from('expo_cms_documents').select('*');
  expect(denied.error).not.toBeNull();
  const rpc = await publicDb.rpc('expo_cms_login_limit', { p_bucket: 'unauthorized-test' });
  expect(rpc.error).not.toBeNull();
  const response = await request.get('/api/content/teams');
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.registrationMode).toBe('offline');
  expect(body.data).toHaveLength(5);
});
test('admin first login, draft publication, conflicts, revisions, media, archive and session revocation', async ({
  page,
  request,
  baseURL,
}) => {
  test.setTimeout(180000);
  const origin = baseURL!;
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/admin\/login$/);
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password', { exact: true }).fill(initialPassword);
  await page.getByRole('button', { name: 'Sign in to the workspace' }).click();
  await expect(page).toHaveURL(/\/admin\/account$/);
  let session = await db.from('expo_cms_sessions').select('csrf').eq('admin_id', userId).single();
  expect(session.error).toBeNull();
  const blocked = await page.request.post('/api/admin/content/updates', {
    headers: { Origin: origin, 'x-csrf-token': session.data!.csrf },
    data: {},
  });
  expect(blocked.status()).toBe(403);
  await page.getByLabel('Current password', { exact: true }).fill(initialPassword);
  await page.getByLabel('New password', { exact: true }).fill(password);
  await page.getByLabel('Confirm new password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Update password & sign out' }).click();
  await expect(page).toHaveURL(/\/admin\/login\?changed=1$/);
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Sign in to the workspace' }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole('heading', { name: 'Your expo, kept up to date.' })).toBeVisible();
  const cookie = (await page.context().cookies()).find((c) => c.name === 'expo_admin_session')!;
  expect(cookie.httpOnly).toBe(true);
  expect(cookie.sameSite).toBe('Strict');
  session = await db.from('expo_cms_sessions').select('csrf').eq('admin_id', userId).single();
  const csrf = session.data!.csrf;
  const headers = { Origin: origin, 'x-csrf-token': csrf };
  expect(
    (
      await page.request.post('/api/admin/content/updates', {
        headers: { Origin: 'https://untrusted.example', 'x-csrf-token': csrf },
        data: {},
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await page.request.post('/api/admin/content/updates', {
        headers: { Origin: origin },
        data: {},
      })
    ).status(),
  ).toBe(403);
  await page.goto('/admin/content/updates/new');
  await page.getByRole('button', { name: 'Save draft', exact: true }).click();
  await expect(page.locator('.admin-content [role="alert"]')).toContainText(
    'Check the highlighted fields',
  );
  const title = `CMS verification ${run}`;
  const slug = `cms-verification-${run}`;
  await page.getByLabel('Title', { exact: false }).fill(title);
  await page.getByLabel('Page address', { exact: false }).fill(slug);
  await page.getByLabel('Publication date', { exact: false }).fill('2026-09-21');
  await page.getByLabel('Category', { exact: false }).fill('Integration check');
  await page
    .getByLabel('Short introduction', { exact: false })
    .fill('A temporary editorial entry used to verify the CMS workflow.');
  await page
    .getByLabel('Article paragraphs', { exact: false })
    .fill('Original published content for this isolated CMS check.');
  await page.getByRole('button', { name: 'Save draft', exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/content\/updates\/[a-f0-9-]{36}$/);
  const id = page.url().split('/').pop()!;
  documentIds.push(id);
  expect((await request.get(`/updates/${slug}`)).status()).toBe(404);
  expect((await request.get('/api/content/updates')).ok()).toBeTruthy();
  await page.getByRole('button', { name: 'Preview draft', exact: true }).click();
  await expect(page.getByText('Private draft preview', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Return to editing' }).click();
  await page.getByRole('button', { name: 'Publish changes', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Published.');
  const publicPage = await request.get(`/updates/${slug}`);
  expect(publicPage.status()).toBe(200);
  expect(await publicPage.text()).toContain('Original published content');
  expect(await (await request.get('/sitemap.xml')).text()).toContain(slug);
  await page
    .getByLabel('Article paragraphs', { exact: false })
    .fill('Private draft text that must not leak to visitors.');
  await page.getByRole('button', { name: 'Save draft', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Draft saved.');
  const text = await (await request.get(`/updates/${slug}`)).text();
  expect(text).toContain('Original published content');
  expect(text).not.toContain('Private draft text');
  let stored = (await (await page.request.get(`/api/admin/content/updates/${id}`)).json()).document;
  const conflict = await page.request.patch(`/api/admin/content/updates/${id}`, {
    headers,
    data: { intent: 'publish', version: 1, data: stored.data },
  });
  expect(conflict.status()).toBe(409);
  const hist = (await (await page.request.get(`/api/admin/content/updates/${id}`)).json())
    .revisions;
  const revision = hist.find((r: { action: string }) => r.action === 'publish');
  const restored = await page.request.patch(`/api/admin/content/updates/${id}`, {
    headers,
    data: { intent: 'restore', version: stored.version, revision: revision.id },
  });
  expect(restored.status()).toBe(200);
  stored = (await restored.json()).document;
  expect(stored.data.content[0]).toContain('Original published');
  expect(stored.state).toBe('changes');
  const archive = await page.request.patch(`/api/admin/content/updates/${id}`, {
    headers,
    data: { intent: 'archive', version: stored.version, data: stored.data },
  });
  expect(archive.status()).toBe(200);
  stored = (await archive.json()).document;
  expect((await request.get(`/updates/${slug}`)).status()).toBe(404);
  const unarchive = await page.request.patch(`/api/admin/content/updates/${id}`, {
    headers,
    data: { intent: 'unarchive', version: stored.version, data: stored.data },
  });
  expect(unarchive.status()).toBe(200);
  expect((await request.get(`/updates/${slug}`)).status()).toBe(200);
  const invalidUpload = await page.request.post('/api/admin/media', {
    headers,
    multipart: {
      file: { name: 'invalid.png', mimeType: 'image/png', buffer: Buffer.from('not an image') },
    },
  });
  expect(invalidUpload.status()).toBe(422);
  const png = await sharp({ create: { width: 64, height: 64, channels: 3, background: '#073f91' } })
    .png()
    .toBuffer();
  const upload = await page.request.post('/api/admin/media', {
    headers,
    multipart: { file: { name: `cms-check-${run}.png`, mimeType: 'image/png', buffer: png } },
  });
  expect(upload.status()).toBe(201);
  const media = await upload.json();
  mediaIds.push(media.id);
  const image = await request.get(media.url);
  expect(image.status()).toBe(200);
  expect(image.headers()['content-type']).toBe('image/webp');
  const exported = await page.request.get('/api/admin/export');
  expect(exported.status()).toBe(200);
  const exportBody = await exported.json();
  expect(exportBody.documents.some((d: { id: string }) => d.id === id)).toBe(true);
  expect(exportBody).not.toHaveProperty('sessions');
  expect(exportBody).not.toHaveProperty('admins');
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of [
      '/admin',
      '/admin/content/updates',
      `/admin/content/updates/${id}`,
      '/admin/media',
      '/admin/activity',
      '/admin/account',
    ]) {
      await page.goto(path);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `${path} at ${width}`,
      ).toBeTruthy();
    }
    await page.goto('/admin');
    await page.screenshot({ path: `test-results/admin-${width}.png`, fullPage: true });
  }
  const accessibility = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(accessibility.violations).toEqual([]);
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);
  expect((await page.request.get('/api/admin/content/updates')).status()).toBe(401);
});
