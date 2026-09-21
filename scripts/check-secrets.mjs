import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Never print matched values: only filenames, line numbers and rule names.
const git = (...args) =>
  execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const findings = [];
const known = [];
if (existsSync('.env.local')) {
  for (const line of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (!match || !/SECRET|PASSWORD|DATABASE_URL/.test(match[1])) continue;
    const value = match[2].replace(/^['"]|['"]$/g, '');
    if (value.length >= 12) known.push(value);
    if (match[1] === 'DATABASE_URL') {
      try {
        const password = decodeURIComponent(new URL(value).password);
        if (password.length >= 8) known.push(password);
      } catch {}
    }
  }
}
if (existsSync('.secrets/admin-initial-access.json')) {
  const access = JSON.parse(readFileSync('.secrets/admin-initial-access.json', 'utf8'));
  if (typeof access.password === 'string' && access.password.length >= 8)
    known.push(access.password);
}
const rules = [
  ['Supabase secret key', /sb_secret_[A-Za-z0-9_-]{20,}/],
  ['GitHub access token', /(?:gh[pousr]_[A-Za-z0-9]{25,}|github_pat_[A-Za-z0-9_]{30,})/],
  ['private key', /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/],
  ['cloud access key', /(?:AKIA|ASIA)[A-Z0-9]{16}/],
  ['credential-bearing database URL', /postgres(?:ql)?:\/\/[^\s:@]+:(?!YOUR_PASSWORD)[^\s@]{8,}@/],
];
function scan(path, content) {
  if (
    (/\.env(?:\.|$)/.test(path) && path !== '.env.example') ||
    /(?:^|\/)(?:\.secrets|\.data|backups|exports)(?:\/|$)/.test(path)
  ) {
    findings.push(`${path}: private file must not be tracked`);
  }
  for (const [index, line] of content.split('\n').entries()) {
    for (const [name, pattern] of rules)
      if (pattern.test(line)) findings.push(`${path}:${index + 1}: ${name}`);
    if (known.some((value) => line.includes(value)))
      findings.push(`${path}:${index + 1}: matches a local private credential`);
    // Supabase legacy JWTs can be service-role credentials, unlike public anon keys.
    for (const token of line.matchAll(/eyJ[A-Za-z0-9_-]+\.([A-Za-z0-9_-]+)\.[A-Za-z0-9_-]+/g)) {
      try {
        if (JSON.parse(Buffer.from(token[1], 'base64url').toString()).role === 'service_role')
          findings.push(`${path}:${index + 1}: service-role JWT`);
      } catch {}
    }
  }
}
let count = 0;
if (process.argv.includes('--history')) {
  const seen = new Set();
  for (const commit of git('rev-list', '--all').trim().split('\n').filter(Boolean)) {
    for (const entry of git('ls-tree', '-r', '-z', commit).split('\0').filter(Boolean)) {
      const match = entry.match(/^\d+ blob ([a-f0-9]+)\t(.+)$/s);
      if (!match || seen.has(match[1])) continue;
      seen.add(match[1]);
      scan(match[2], git('cat-file', 'blob', match[1]));
      count++;
    }
  }
} else if (process.argv.includes('--build')) {
  function walk(path) {
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      const full = join(path, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(?:js|json|html|css|map)$/.test(entry.name)) {
        scan(full, readFileSync(full, 'utf8'));
        count++;
      }
    }
  }
  if (!existsSync('.next/static'))
    throw new Error('Run npm run build before checking public bundles.');
  walk('.next/static');
} else {
  const staged = process.argv.includes('--staged');
  const paths = (
    staged
      ? git('diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z')
      : git('ls-files', '-z')
  )
    .split('\0')
    .filter(Boolean);
  for (const path of paths) {
    scan(path, staged ? git('show', `:${path}`) : readFileSync(path, 'utf8'));
    count++;
  }
}
if (!count) {
  console.error('No files inspected. Stage or track the project before running the audit.');
  process.exitCode = 1;
} else if (findings.length) {
  console.error(`Secret audit failed:\n${[...new Set(findings)].join('\n')}`);
  process.exitCode = 1;
} else
  console.log(
    `Secret audit passed: ${count} files inspected; no configured secret patterns or local private credentials found.`,
  );
