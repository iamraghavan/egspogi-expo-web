import 'server-only';
import { cookies } from 'next/headers';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { serviceClient, loginClient } from './supabase';
import { CmsError } from './store';
export const COOKIE_NAME = 'expo_admin_session';
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 8 * 60 * 60,
};
const digest = (value: string) => createHash('sha256').update(value).digest('hex');
export interface AdminSession {
  id: string;
  email: string;
  csrf: string;
  mustChangePassword: boolean;
}
export async function session(): Promise<AdminSession | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const db = serviceClient();
  const { data, error } = await db
    .from('expo_cms_sessions')
    .select('admin_id,csrf,expires_at')
    .eq('token_hash', digest(token))
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();
  if (error) throw new CmsError('Authentication service is unavailable. Please try again.', 503);
  if (!data) return null;
  const { data: admin, error: adminError } = await db
    .from('expo_cms_admins')
    .select('id,email,must_change_password')
    .eq('id', data.admin_id)
    .eq('enabled', true)
    .maybeSingle();
  if (adminError) throw new CmsError('Authentication service is unavailable.', 503);
  return admin
    ? {
        id: admin.id,
        email: admin.email,
        csrf: data.csrf,
        mustChangePassword: admin.must_change_password,
      }
    : null;
}
export function assertOrigin(request: Request) {
  const origin = request.headers.get('origin');
  const expected = process.env.CMS_ORIGIN || new URL(request.url).origin;
  if (
    !origin ||
    origin !== new URL(expected).origin ||
    request.headers.get('sec-fetch-site') === 'cross-site'
  )
    throw new CmsError('This request must originate from the admin website.', 403);
}
export async function authorize(request?: Request, allowPasswordChange = false) {
  const admin = await session();
  if (!admin) throw new CmsError('Sign in to continue.', 401);
  if (request && !['GET', 'HEAD'].includes(request.method)) {
    assertOrigin(request);
    const token = request.headers.get('x-csrf-token') || '';
    const a = Buffer.from(token);
    const b = Buffer.from(admin.csrf);
    if (a.length !== b.length || !timingSafeEqual(a, b))
      throw new CmsError('Your security token is invalid. Reload the dashboard.', 403);
    if (admin.mustChangePassword && !allowPasswordChange)
      throw new CmsError('Change your initial password before editing content.', 403);
  }
  return admin;
}
export async function signIn(email: string, password: string) {
  const db = serviceClient();
  const normalized = email.toLowerCase().trim();
  const { data: allowed, error: limitError } = await db.rpc('expo_cms_login_limit', {
    p_bucket: digest(normalized),
  });
  if (limitError) throw new CmsError('Authentication service is not ready.', 503);
  if (!allowed) throw new CmsError('Too many sign-in attempts. Try again in 15 minutes.', 429);
  const auth = loginClient();
  const { data, error } = await auth.auth.signInWithPassword({ email: normalized, password });
  if (error || !data.user)
    throw new CmsError(
      'The email or password is incorrect, or this account has no CMS access.',
      401,
    );
  const { data: admin } = await db
    .from('expo_cms_admins')
    .select('id,email,must_change_password')
    .eq('id', data.user.id)
    .eq('enabled', true)
    .maybeSingle();
  await auth.auth.signOut({ scope: 'local' });
  if (!admin)
    throw new CmsError(
      'The email or password is incorrect, or this account has no CMS access.',
      401,
    );
  const token = randomBytes(32).toString('hex');
  const csrf = randomBytes(32).toString('hex');
  await db.from('expo_cms_sessions').delete().lt('expires_at', new Date().toISOString());
  const { error: sessionError } = await db.from('expo_cms_sessions').insert({
    token_hash: digest(token),
    admin_id: admin.id,
    csrf,
    expires_at: new Date(Date.now() + cookieOptions.maxAge * 1000).toISOString(),
  });
  if (sessionError) throw new CmsError('Could not create your session.', 503);
  await db.from('expo_cms_login_attempts').delete().eq('bucket', digest(normalized));
  await db.from('expo_cms_audit').insert({
    action: 'sign-in',
    collection: 'account',
    document_id: admin.id,
    title: 'Administrator sign-in',
    actor: admin.email,
  });
  return { token, mustChangePassword: admin.must_change_password };
}
export async function signOut() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (token) {
    const { error } = await serviceClient()
      .from('expo_cms_sessions')
      .delete()
      .eq('token_hash', digest(token));
    if (error) throw new CmsError('Could not revoke the session. Try again.', 503);
  }
}
export async function changePassword(admin: AdminSession, current: string, next: string) {
  if (next.length < 14 || next.length > 128 || next === current)
    throw new CmsError('Use a different password between 14 and 128 characters.', 422);
  const auth = loginClient();
  const { data, error } = await auth.auth.signInWithPassword({
    email: admin.email,
    password: current,
  });
  if (error || data.user?.id !== admin.id)
    throw new CmsError('Your current password is incorrect.', 422);
  await auth.auth.signOut({ scope: 'local' });
  const db = serviceClient();
  const { error: updateError } = await db.auth.admin.updateUserById(admin.id, { password: next });
  if (updateError) throw new CmsError('The password could not be updated.', 503);
  const { error: revokeError } = await db
    .from('expo_cms_sessions')
    .delete()
    .eq('admin_id', admin.id);
  if (revokeError)
    throw new CmsError(
      'Password updated, but session revocation failed. Contact the system administrator.',
      503,
    );
  const { error: flagError } = await db
    .from('expo_cms_admins')
    .update({ must_change_password: false })
    .eq('id', admin.id);
  if (flagError)
    throw new CmsError('Password updated. Sign in again to finish account setup.', 503);
  await db.from('expo_cms_audit').insert({
    action: 'password-changed',
    collection: 'account',
    document_id: admin.id,
    title: 'Password changed; sessions revoked',
    actor: admin.email,
  });
}
