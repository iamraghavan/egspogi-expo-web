# Science Expo 2026

Public event website and organiser CMS for **EGS Pillay Group of Institutions**, built with Next.js App Router and TypeScript. The Modular Science Modernism identity combines navy and cream, editorial typography and geometric science illustrations.

Repository: [iamraghavan/egspogi-expo-web](https://github.com/iamraghavan/egspogi-expo-web).

**Registration is offline only.** The website provides campus desk instructions and preparation checklists; it does not collect registrations or payments. Dates, programme entries, projects and help-desk contacts are sample information until organisers confirm them.

## Run locally

Use Node.js 24 LTS and npm. From the repository root:

```sh
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000). Copy `.env.example` to `.env.local` and complete the Supabase setup below first: public pages read published CMS content. Never commit credentials. Initial sample content is seeded into the configured database automatically on first access.

On the original Windows workspace, enable the portable runtime if Node is not on PATH:

```powershell
$env:Path = (Resolve-Path '..\.tools\node-v24.21.0-win-x64').Path + ';' + $env:Path
npm.cmd run dev
```

## Pages and features

| Area               | Routes / capabilities                                                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Event information  | `/`, `/about`, `/themes`, `/participate`, `/faq`, `/contact`                                                                                     |
| Exhibits           | `/projects`, `/projects/[slug]`; text search, category filters and profiles                                                                      |
| Programme and news | `/schedule`, `/updates`, `/updates/[slug]`                                                                                                       |
| Gallery and campus | `/gallery`, `/venue`; interactive MapCN campus map                                                                                               |
| Help desk          | `/help-desk`, `/help-desk/[slug]`; registration, food/accommodation, venue, technical and visitor/accessibility teams                            |
| Science playground | `/experience`; signal transmission, satellite orbit and airflow experiments                                                                      |
| CMS                | `/admin/login`, `/admin`, `/admin/content/[collection]`, `/admin/content/[collection]/[id]`, `/admin/media`, `/admin/activity`, `/admin/account` |

Help-desk profiles include a contact person, email, phone, desk location and hours. Dummy contacts are labelled and not clickable. The supplied official SVG logo appears in the responsive header. The contact form validates input locally and explicitly says no message has been sent; real message delivery is not enabled.

## CMS setup

1. Configure a Supabase project and put its URL, publishable key and server-only secret key in `.env.local`, following `.env.example`.
2. Set `DATABASE_URL` locally for the migration CLI. Run `npm run db:migrate`. The migration creates namespaced `expo_cms_*` tables, policies and RPCs, preserving unrelated existing tables.
3. Run `npm run admin:create -- --email organiser@example.org`. A random initial password is written to ignored `.secrets/admin-initial-access.json`. The script refuses to overwrite an existing access file or reset an existing account.
4. Sign in at `/admin/login`; first login requires a password change. For an existing configured account, use its current credentials rather than rerunning setup.
5. Save drafts, preview, publish, inspect revisions, restore a revision as a draft, archive or restore entries. Published slugs remain stable. Concurrent edits produce a conflict instead of silently overwriting another organiser's changes.

Collections: **projects, updates, schedule, gallery, teams, FAQs, notices and event settings**. Public pages and `/api/content/[collection]` expose published content only. Registration mode remains offline.

Supabase Auth identities require an explicit organiser allowlist entry. Opaque sessions are hashed in the database, expire after eight hours and use HttpOnly cookies. Writes require same-origin and CSRF validation. Password changes invalidate application sessions. Public Supabase keys cannot access CMS tables directly.

Uploads accept JPEG, PNG and WebP up to 2 MB, normalize with `sharp`, strip metadata and store WebP images in Supabase. This persists across serverless deployments and suits a small event gallery; a large media library should use object storage. JSON exports are for small datasets, not a replacement for managed backups; large exports can encounter database row or hosting response limits.

## Campus map and animation

The campus coordinate is centralized in `src/data/venue.ts`: **10.803727755112378, 79.83338948965753**. Map controls include marker popup/tooltip, zoom, compass, optional geolocation, fullscreen, recenter, style toggle, coordinate copy and directions. CARTO/OpenStreetMap attribution remains visible. Location denial is handled. Local MapLibre workers are prepared automatically on install, dev and build.

| Library                                            | Purpose                                                                                                                 |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| GSAP core, ScrollTrigger, DrawSVGPlugin, SplitText | Heading entrances, section reveals, reading progress, SVG drawing and button feedback                                   |
| Anime.js                                           | Signal experiment using Timer, Animation, Timeline, Animatable, Draggable, Scope, Scroll, SVG, Utils, Easings and WAAPI |
| Framer Motion                                      | Mobile navigation, gallery layout changes and experiment panel transitions                                              |
| Three.js                                           | Faceted planet and adjustable satellite orbit                                                                           |
| Babylon.js                                         | Adjustable wing with illustrative airflow                                                                               |

Experiments load on demand, start still and offer keyboard-operable sliders and play/pause controls. Render loops pause offscreen and in hidden tabs; resources are disposed on unmount. System reduced-motion preferences take precedence over the persistent footer motion control. These are conceptual visual models, not engineering simulations.

## Project structure

```text
src/
  app/                  Public pages, admin pages, APIs and SEO metadata
  components/
    layout/             Institutional header, navigation and footer
    ui/                 Shared primitives and MapCN wrapper
    expo/               Artwork, cards, filters, schedule, FAQs and map
    admin/              CMS shell, editors, media, account and activity
    motion/             GSAP lifecycle and motion preferences
    experience/         Lazy-loaded science experiments
  data/                 Centralized sample content and venue coordinates
  lib/cms/              Validation, storage, authorization and public adapters
  styles/               Operations, admin and animation styles
  types/                Shared content types
public/                 Official logo, SVG artwork and draft guidelines
supabase/migrations/    CMS schema and security policies
scripts/                Migration, admin setup, map preparation and secret checks
tests/                  Browser, security and accessibility checks
.githooks/              Local pre-commit secret check
```

## Validation and repository security

```sh
npm run lint
npm run typecheck
npm run build
npm test
npm run security:check
npm run security:staged
npm run security:history
npm run security:build
npm run security:test
git config core.hooksPath .githooks
```

Browser tests expect a running app at `http://localhost:3000` and installed Google Chrome; override with `TEST_BASE_URL`. CMS tests require configured Supabase credentials and create/delete isolated test accounts and records: use a dedicated test project. They cover authentication, draft publication, conflicts, revisions, uploads, archive/restore and session revocation. Public tests cover routes, links, images, filters, keyboard behavior, responsive layouts and axe accessibility. Experiment tests exercise all three engines and reduced motion. Automated checks do not certify full WCAG compliance.

Secret checks scan tracked files, staged snapshots, Git history or public build bundles. They compare against local private credentials without printing matched values. Enable the hook once per clone; review staged changes before pushing. `.gitignore` excludes real environment files, secrets, exports, logs and local deployment metadata. See [SECURITY.md](SECURITY.md).

## Deploy to Vercel

1. Import this repository, using its root as the Next.js project root, Node.js 24, `npm ci` and `npm run build`.
2. Configure Supabase runtime variables in Vercel. Keep `SUPABASE_SECRET_KEY` server-only. `DATABASE_URL` is for migrations and is not needed by the hosted runtime.
3. Set `NEXT_PUBLIC_SITE_URL` and `CMS_ORIGIN` to the exact final HTTPS origin; use separate preview settings where appropriate.
4. Apply migrations and create the organiser account separately; builds never perform these administrative actions.
5. Confirm dates, programme, desk instructions and real contacts in the CMS. Replace sample exhibits/images, update downloadable guidelines and disable the preview notice only when details are approved.
6. Rotate credentials previously shared outside a secret manager before production launch. Verify login, publishing, media, offline registration information and directions on the deployed domain.

This is a server-rendered Next.js app with APIs, not a static export. No production deployment has been created by this setup.

## Packages and licensing

Runtime: Next.js, React, Supabase JS, Tailwind CSS, Lucide, Framer Motion, GSAP, Anime.js, Three.js, Babylon.js, MapLibre, sharp, clsx and tailwind-merge. `pg` supports the migration CLI. Development: TypeScript, ESLint, Prettier, Playwright and axe. Exact versions are in `package-lock.json`.

Original code: [MIT](LICENSE). Institutional branding is excluded: [Brand notice](BRAND-NOTICE.md). Dependencies retain their own terms, including GSAP's standard license: [Third-party notices](THIRD-PARTY-NOTICES.md).

For agent continuation, read [HANDOFF.md](HANDOFF.md), [AGENTS.md](AGENTS.md) and [CLAUDE.md](CLAUDE.md).
