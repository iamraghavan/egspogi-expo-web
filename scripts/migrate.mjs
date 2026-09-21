import { readFileSync } from 'node:fs';
import pg from 'pg';
if (!process.env.DATABASE_URL) throw new Error('Set DATABASE_URL in .env.local to run migrations.');
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true,
    ca: readFileSync(new URL('./certs/supabase-ca.crt', import.meta.url), 'utf8'),
  },
  connectionTimeoutMillis: 15000,
});
try {
  await client.connect();
  await client.query(
    readFileSync(new URL('../supabase/migrations/001_expo_cms.sql', import.meta.url), 'utf8'),
  );
  const result = await client.query(
    "SELECT count(*)::int AS count FROM pg_tables WHERE schemaname='public' AND tablename LIKE 'expo_cms_%' AND rowsecurity=true",
  );
  console.log(
    `CMS schema installed. ${result.rows[0].count} CMS tables have row-level security enabled. Existing non-CMS tables were not changed.`,
  );
} catch (error) {
  console.error('Migration failed:', error.code || error.name, error.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
