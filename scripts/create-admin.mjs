import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'node:crypto';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
const bootstrap = process.argv.includes('--bootstrap');
const emailIndex = process.argv.indexOf('--email');
const email =
  emailIndex >= 0 ? process.argv[emailIndex + 1] : bootstrap ? 'expo-admin@example.org' : null;
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  throw new Error('Usage: npm run admin:create -- --email organiser@example.org');
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY)
  throw new Error('Configure the server Supabase environment first.');
const accessPath = '.secrets/admin-initial-access.json';
if (existsSync(accessPath))
  throw new Error(
    'An initial access file already exists. Preserve it; remove it manually only after the existing account setup is complete.',
  );
const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const { data: existing, error: checkError } = await db
  .from('expo_cms_admins')
  .select('id')
  .eq('email', email)
  .maybeSingle();
if (checkError) throw new Error('Install the CMS schema first with npm run db:migrate.');
if (existing)
  throw new Error(
    'This CMS account already exists. Existing account credentials will not be changed.',
  );
const password = randomBytes(24).toString('base64url');
const { data, error } = await db.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { purpose: 'Science Expo organiser workspace' },
});
if (error || !data.user) throw new Error(error?.message || 'Account creation failed.');
const { error: allowError } = await db
  .from('expo_cms_admins')
  .insert({ id: data.user.id, email, must_change_password: true });
if (allowError) {
  console.error(
    'Auth account created but CMS approval failed. Retry approval for the newly created account; do not modify unrelated users.',
  );
  process.exitCode = 1;
} else {
  mkdirSync('.secrets', { recursive: true });
  writeFileSync(
    accessPath,
    JSON.stringify(
      {
        url: 'http://localhost:3000/admin/login',
        email,
        password,
        note: 'Change this initial password on first sign-in. This file is ignored by git. Delete it after setup.',
      },
      null,
      2,
    ),
    { mode: 0o600, flag: 'wx' },
  );
  console.log(
    `Dedicated CMS account created. Initial credentials saved privately in ${accessPath}. Password not printed. First-login password change is required.`,
  );
}
