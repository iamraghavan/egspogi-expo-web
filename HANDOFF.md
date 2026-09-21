# Science Expo 2026 — Codex / Claude handoff

Updated: 2026-09-21. The public website, Supabase mini CMS, offline help desks, interactive campus map, official header logo and animation expansion are implemented. Read the actual source and latest verification results before changing anything. Do not rebuild the project.

## Continuation message

> Continue this repository from HANDOFF.md, README.md, CLAUDE.md and AGENTS.md. Preserve offline-only registration and the Modular Science Modernism visual identity. Supabase credentials and initial admin access live only in ignored local files; never print or publish them. The application is implemented. Check the remaining deployment/content tasks below, preserve user changes, run relevant checks and keep this handoff current. Do not recreate or reset the organiser account.

## User decisions

- Institution: EGS Pillay Group of Institutions. Event: Science Expo 2026.
- Next.js App Router, TypeScript, Tailwind, npm. No heavy UI framework. The MapCN wrapper was explicitly requested through the shadcn registry.
- Registration is OFFLINE ONLY. No online registration forms, submission API, payments or registration links.
- Dummy help-desk contacts were requested. Mark them as placeholders and never expose working contact links until verified.
- Hosting target: Vercel or another serverless platform; durable CMS content/media in Supabase.
- Campus: latitude 10.803727755112378, longitude 79.83338948965753.
- User explicitly requested GSAP (core/scroll/SVG/UI/text), all listed Anime.js APIs, Framer Motion, Three.js and Babylon.js. They are implemented with restrained site-wide effects and optional experiments.
- Official logo copied from the user's Downloads to public/egs-pillay-group-logo-flat-dark.svg; header uses next/image with responsive sizing.
- GitHub repository: https://github.com/iamraghavan/egspogi-expo-web.git. User requested integration, secret protection, a license and refreshed documentation.
- MIT license covers original code. BRAND-NOTICE.md reserves institutional branding. THIRD-PARTY-NOTICES.md identifies dependencies and the vendored MapCN license.

## Implemented

1. All public routes from the brief, including project/update detail pages, search/filter controls, accessible FAQ, schedule, gallery and contact form validation.
2. Offline participation guidance and five dedicated help teams: registration, food-accommodation, venue-support, technical-support and visitor-accessibility.
3. Complete organiser dashboard: overview/readiness, eight content collections, draft previews, publishing, stable public slugs, optimistic concurrency, revisions/restore, archive/unarchive, media upload, activity, export and password management.
4. Supabase schema applied to the configured project. Runtime uses HTTPS SDK; pg is migration-only. Prefixed CMS tables have RLS and revoked public grants. The server secret never enters client components.
5. Opaque session cookies with database token hashes, expiration, origin/CSRF checks, login throttling and mandatory first-login password change.
6. A dedicated organiser account was created. Its email is expo-admin@example.org. Initial access is in ignored .secrets/admin-initial-access.json. The user has already received the initial credentials. Never print them in repository docs or reset this account.
7. Public pages, details and sitemap read published CMS data. The configured database is required at runtime. Sample seed records are inserted once with stable IDs; no unrelated tables are modified.
8. MapCN/MapLibre campus map with marker popup/tooltip, directions, zoom/compass/location/fullscreen, recenter, coordinate copy and style toggle. Worker files are generated into ignored public/map-assets.
9. /experience has an Anime.js signal experiment, Three.js orbit explorer and Babylon.js airflow illustration. Libraries load on demand; render loops pause offscreen/hidden and dispose on unmount.
10. GSAP headings, SVG lines, scroll reveals, reading progress and button feedback. Framer Motion navigation, gallery layout and experiment transitions. System reduced motion wins; footer preference persists.
11. Repository exclusions, secret scan commands, optional pre-commit hook, license/branding/security notices and rewritten README.

## Important files

- src/lib/cms/schema.ts: collection fields, types, validation and defaults.
- src/lib/cms/auth.ts: authentication, sessions, CSRF and password enforcement.
- src/lib/cms/store.ts: seed, public content, transactional writes, revisions, audit.
- src/lib/cms/public.ts: page-facing cached content adapters.
- src/app/api/admin/: protected endpoints; src/app/api/content/: published content only.
- src/components/admin/: dashboard and editors; src/styles/admin.css.
- src/components/expo/InteractiveCampusMap.tsx and src/components/ui/map.tsx.
- src/components/motion/: lifecycle and preferences.
- src/components/experience/: optional science experiments.
- supabase/migrations/001_expo_cms.sql: schema, RLS, RPCs.
- scripts/create-admin.mjs: creates new dedicated admin, refuses overwriting local access file/account.
- scripts/migrate.mjs and scripts/certs/supabase-ca.crt: verified-TLS migration.
- scripts/check-secrets.mjs: checks tracked/staged/history/public-build files without logging secret values.
- tests/cms.spec.ts: isolated remote test user/documents, cleaned up after run.
- tests/site.spec.ts, venue-help.spec.ts, experience.spec.ts: public behavior/accessibility/map/motion.

## Local environment

Project on original machine: F:/EGSPGOI Projects/Expo Projects/science-expo-2026.

Node and Git are portable under the parent .tools directory:

- node-v24.21.0-win-x64
- mingit/cmd (official MinGit download verified using GitHub asset SHA-256)

PowerShell:

```powershell
$env:Path = 'F:/EGSPGOI Projects/Expo Projects/.tools/mingit/cmd;F:/EGSPGOI Projects/Expo Projects/.tools/node-v24.21.0-win-x64;' + $env:Path
npm.cmd run dev
```

Use npm install / npm run dev on machines with Node on PATH. The development server is intended to remain available at http://localhost:3000. Check for an existing server before starting another one.

On this workspace, sandboxed Node/browser writes can return EPERM. Request the normal tool escalation for the specific command rather than bypassing permissions. Git's safe.directory exception is scoped to this exact project path. Local Git identity uses the owner's GitHub noreply address.

## Verification

- Production build and TypeScript compilation passed with all routes, including CMS and experiments.
- ESLint passed with zero errors. Generated map assets are excluded from lint.
- CMS browser tests passed: first-login password enforcement, authentication, authorization, CSRF, private drafts, publication, sitemap, conflicts, revisions, archive/restore, media, export, mobile dashboard, axe and logout.
- Experiment browser tests passed for real Three.js/Babylon.js rendering, Anime.js controls, responsive widths, axe, persisted preference and system reduced motion.
- Initial staged audit passed for 133 source files; .env.local, .secrets and generated workers were verified ignored.
- Full browser run: 10 passed and 2 accessibility failures. Both failures were fixed (text opacity and reduced-motion scrolling); both targeted reruns passed. All 12 browser checks now have passing results.
- Secret-guard regression test passed: placeholder acceptance, staged-token rejection, local credential matching and no matched-value logging.
- Browser bundle audit passed for 88 files; no configured secret patterns or local private credentials found.
- Server restarted at the user's request; homepage and admin login both returned HTTP 200 at localhost:3000.
- GitHub integration complete: source published on `main` at https://github.com/iamraghavan/egspogi-expo-web. The fetched Git tree exactly matched the audited 134-file local index. Local `main` tracks `origin/main`; repository history passed the secret scan. No real environment files, initial-access credentials or generated assets were uploaded.
- Final build after accessibility fixes passed, including TypeScript; lint passed. The server remains running for the user.

## Remaining launch decisions and practical limits

- Set the final domain and exact CMS_ORIGIN in Vercel. No production deployment is configured by this setup.
- Rotate credentials previously shared in chat; update ignored local settings and deployment secrets. Do not paste replacements into conversations or commits.
- Confirm organiser email/account ownership, real help-desk details, desk hours, dates, programme, eligibility and approved media. Update downloadable guidelines separately from CMS text.
- Contact message delivery is deliberately not connected; the form tells visitors nothing was sent.
- Media is bounded WebP data in Supabase tables, appropriate for a small event site. Move to object storage for large galleries.
- JSON exports currently use ordinary queries/responses; large datasets can hit Supabase row and Vercel response limits. Use managed database backups for complete operational backups.
- Configure/confirm the production tile provider's terms and capacity. Directions remain available if external tiles fail.
- Consider enabling GitHub's native push protection/private vulnerability reporting in repository settings. Local scanners do not guarantee detection of every kind of sensitive information.
