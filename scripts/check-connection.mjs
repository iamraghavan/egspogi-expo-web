import pg from 'pg';
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true,
    ca: readFileSync(new URL('./certs/supabase-ca.crt', import.meta.url), 'utf8'),
  },
  connectionTimeoutMillis: 10000,
});
try {
  await client.connect();
  const result = await client.query('SELECT current_database() as database');
  console.log('PostgreSQL connection verified:', result.rows[0].database);
} catch (error) {
  console.log(
    'PostgreSQL connection status:',
    error.code || error.name,
    error.message?.replace(/postgresql:\/\/\S+/g, '[redacted]'),
  );
} finally {
  await client.end();
}
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
console.log('Supabase server API:', error ? error.message : 'Authenticated successfully');
console.log('Existing administrator setup required:', !data?.users?.length);
