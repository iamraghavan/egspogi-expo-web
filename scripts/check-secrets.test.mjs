import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { resolve, join, sep } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

test('secret guard accepts placeholders, rejects staged tokens and never prints matched values', () => {
  const scanner = resolve('scripts/check-secrets.mjs');
  const root = resolve('.secrets');
  mkdirSync(root, { recursive: true });
  const fixture = mkdtempSync(join(root, 'scanner-test-'));
  const git = (...args) => execFileSync('git', args, { cwd: fixture, stdio: 'pipe' });
  const run = () =>
    spawnSync(process.execPath, [scanner, '--staged'], { cwd: fixture, encoding: 'utf8' });
  try {
    git('init', '-q');
    writeFileSync(
      join(fixture, '.env.example'),
      'DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres\n',
    );
    git('add', '.env.example');
    assert.equal(run().status, 0);
    const token = ['sb', 'secret', randomBytes(24).toString('hex')].join('_');
    writeFileSync(join(fixture, 'unsafe.ts'), `export const value = '${token}';`);
    git('add', 'unsafe.ts');
    const rejected = run();
    assert.equal(rejected.status, 1);
    assert.match(rejected.stderr, /unsafe.ts/);
    assert.ok(!`${rejected.stdout}${rejected.stderr}`.includes(token));
    // Fixing only the working file must not bypass the staged-content check.
    writeFileSync(join(fixture, 'unsafe.ts'), 'export const value = "removed";');
    assert.equal(run().status, 1);
    git('add', 'unsafe.ts');
    assert.equal(run().status, 0);
    const password = randomBytes(24).toString('base64url');
    writeFileSync(join(fixture, '.env.local'), `DATABASE_PASSWORD=${password}\n`);
    writeFileSync(join(fixture, 'unsafe.ts'), `export const value = '${password}';`);
    git('add', 'unsafe.ts');
    const knownSecret = run();
    assert.equal(knownSecret.status, 1);
    assert.match(knownSecret.stderr, /local private credential/);
    assert.ok(!`${knownSecret.stdout}${knownSecret.stderr}`.includes(password));
  } finally {
    const target = resolve(fixture);
    if (!target.startsWith(root + sep) || !target.split(sep).pop().startsWith('scanner-test-'))
      throw new Error('Unexpected test cleanup path');
    rmSync(target, { recursive: true, force: true });
  }
});
