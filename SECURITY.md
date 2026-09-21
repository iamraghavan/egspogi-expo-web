# Security

Do not post credentials, contact exports, database dumps or session cookies in public issues. Report a suspected vulnerability privately to the repository owner through GitHub's private security reporting, when enabled, or an existing private channel.

## Repository protections

- `.gitignore` excludes environment files, `.secrets`, private exports, backups, local credentials, logs, browser authentication state and deployment metadata. `.env.example` contains placeholders only.
- `npm run security:check` examines tracked files; `npm run security:staged` examines the staged snapshot. `npm run security:history` scans Git history. `npm run security:build` scans browser bundles and compares them with local private credentials without printing their values.
- Enable the local pre-commit check with `git config core.hooksPath .githooks`. Hooks are local configuration and must be enabled in each clone. Pattern checks are a guardrail, not proof that arbitrary sensitive data cannot be present.
- Review `git diff --cached` before pushing. Never use `git add -f` on ignored configuration or private exports.

## Application controls

CMS access requires a Supabase Auth identity and an enabled organiser allowlist entry. Sessions use hashed opaque tokens, HttpOnly cookies, expiration, origin checks and CSRF protection. First login requires a password change. CMS tables use RLS with no direct public-key access. Published content is served through the server API; draft content remains private.

Keep `SUPABASE_SECRET_KEY` and `DATABASE_URL` server-only. They must never have a `NEXT_PUBLIC_` prefix. Migrations run separately from the website. On Vercel, store runtime credentials in project environment settings and set `CMS_ORIGIN` to the exact production HTTPS origin.

## If a credential was exposed

Revoke or rotate it at its provider, update local/deployment settings, invalidate affected sessions and inspect access logs. Removing a value from Git or a message does not revoke it. Credentials previously shared in chat should be rotated before production deployment. Do not paste replacement secrets into issues, commits or documentation.
