# portfolio-core

**[View live demo →](https://j-falcon122.github.io/portfolio-core/)**

**Reusable portfolio package** built with Next.js, TypeScript, and pluggable CMS providers.

Install a tagged release directly from GitHub:

```bash
npm install github:j-falcon122/portfolio-core#v1.0.2
```

Consumer applications should add `portfolio-core` to `transpilePackages` in
`next.config.ts` and import shared modules from `portfolio-core/lib/...` or
`portfolio-core/components/...`.

A reusable, production-minded foundation for portfolios, creators, agencies, and small businesses—Composable content blocks, interchangeable CMS backends, and environment-aware configuration so you can ship tailored sites without rebuilding plumbing each time.

This project is intentionally designed around **composable content blocks** and **interchangeable CMS providers** to support rapid customization across multiple websites and clients.

---

## Features

- **Next.js** App Router
- **TypeScript**
- **Tailwind CSS** (v4) and scoped block styles under `app/styles/`
- **CMS abstraction layer** (`lib/cms/`) with a stable content contract
- **Mock CMS provider** for fast local work without external services
- **Sanity CMS** provider and Studio (`sanity/`, `npm run sanity:dev`)
- **Reusable content blocks** (hero, gallery, text, video, CTA, about, contact—and carousel utilities where used)
- **Shared layout** via `SiteHeader` / `SiteFooter` and App Router layouts
- **Environment-aware behavior** (local vs QA vs production) via `SITE_ENV`, `VERCEL_ENV`, and `lib/deployEnv.ts`
- **Deployment-ready** structure; **Vercel**-friendly (`vercel.json`, image domains for Sanity CDN) or **GitHub Pages** (static export workflow)
- **CI**: GitHub Actions for lint, tests, content validation, and optional Pages deploy

---

## Repository architecture

Intentional layout—this is closer to a small **platform** than a single static page.

```text
app/                    # Route layer: pages, layouts, global CSS
  styles/               # Block-level and shared styles (co-located with routes)
components/
  blocks/               # Reusable content sections (driven by CMS / mock JSON)
  SiteHeader.tsx        # Shared chrome
  SiteFooter.tsx
lib/
  cms/                  # CMS abstraction: types, factory, provider selection
    providers/          # mock + Sanity implementations (swap backends here)
  deployEnv.ts          # Resolves local | qa | production for admin URLs, etc.
content/mock/           # Mock CMS JSON when CMS_PROVIDER=mock
public/                 # Static assets
sanity/                 # Sanity Studio config and schema types
docs/                   # Deeper architecture and content notes
scripts/                # Package maintenance, validation, and Sanity helpers
```

| Area | Role |
|------|------|
| **`app/`** | Routes and layout shell; wires pages to CMS data and blocks. |
| **`components/blocks/`** | Presentational sections mapped from structured content (block renderer → components). |
| **`lib/cms/providers/`** | Pluggable backends; add or swap providers without rewriting pages. |
| **`components/` (layout)** | Shared navigation and footer used across routes. |
| **`sanity/`** | Schema and Studio for teams that edit content in Sanity. |

For boundaries between the package and consuming applications, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## Environment strategy

The app distinguishes **local**, **QA** (preview/staging), and **production**—see `lib/deployEnv.ts` and `.env.example`.

| Environment | Purpose | Typical configuration |
|-------------|---------|------------------------|
| **local** | Development on your machine (`next dev`) | `.env.local` — e.g. `CMS_PROVIDER=mock` or Sanity vars; optional `SITE_ENV=local` |
| **qa** | Staging / preview (e.g. Vercel preview) | Set in hosting dashboard: `SITE_ENV=qa`, staging dataset, `ADMIN_NAV_URL` → hosted Studio |
| **production** | Live site | Production env vars; `SITE_ENV=production` (or rely on host defaults); `SANITY_DATASET` and Studio URL as appropriate |

**Env files (conceptual mapping)**

| File | Role |
|------|------|
| `.env.local` | Local secrets and overrides (gitignored). Primary file for `npm run dev`. |
| `.env.production` | Optional: values when running production builds locally (`next build` / `next start`). Production deploys usually use the host’s env UI instead. |
| `.env.qa` | Not loaded by Next.js automatically—use as a **documented copy** of QA/preview variables, or load via your orchestration (e.g. CI, `dotenv-cli`). Vercel **Preview** environments typically hold QA vars in the dashboard. |

**Admin / Studio links:** On local, admin often points at `http://localhost:3333` when running `npm run sanity:dev`. For QA and production, set `ADMIN_NAV_URL` to your deployed Sanity Studio. Details are in `.env.example` and the previous “QA vs production” behavior is folded into the table above.

**Contact form:** Prefer `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` for static hosts (GitHub Pages). Use `RESEND_API_KEY` + `CONTACT_FORM_TO_EMAIL` only when the site runs a Node server that ships `app/api/contact`. Hosts can force a transport with the `submitMode` prop on `ContactBlock` / `ContactForm`.

---

## Long-term vision

This starter can grow into your **freelance or agency baseline**, an **internal framework**, a **paid template**, or a **white-label** content site system—because the hard parts (routing, blocks, CMS boundary, env awareness) are already separated from one-off page copy.

---

## Near-term roadmap (suggestions)

**Infrastructure**

- Branch strategy (`main`, `qa`, `feature/*`)
- Vercel environments aligned with preview vs production
- Branch protections and required checks
- Stricter lint/format consistency and CI gates

**CMS**

- Finalize Sanity schemas; portable text and SEO fields where needed
- Image optimization patterns and asset conventions
- More block types as reusable primitives

**UX**

- Motion, theme tokens, accessibility passes
- Loading states and skeletons for async CMS routes

**Reusability**

- Config-driven header/footer and global theme tokens
- Shared sections (e.g. testimonials, pricing, team) as new blocks when needed

---

## Project intent

- This repository is the reusable **core package** consumed by downstream portfolio applications.
- **Business-specific logic** should live in downstream repositories, not here.
- Workflow: improve this package → bump its version and create a tag → install that tag in downstream applications.

---

## Quick start

1. Install a tagged package release:

   ```bash
   npm install github:j-falcon122/portfolio-core#v1.0.2
   ```

2. Configure Next.js:

   ```ts
   const nextConfig = {
     transpilePackages: ["portfolio-core"],
   };
   ```

3. Import shared modules from `portfolio-core/lib/...` and `portfolio-core/components/...`.
4. Keep application-specific routes, content, branding, and assets in the consumer repository.
5. Set `CMS_PROVIDER` in the consumer's `.env.local`:
   - `mock` — no external CMS
   - `sanity` — content from Sanity

---

## What this package includes

- App Router scaffolding with example routes and block-driven pages.
- CMS abstraction with mock and Sanity providers.
- Content-driven blocks under `components/blocks/`.
- Tailwind and block-scoped CSS under `app/styles/`.

### Package boundaries

- Keep this repo **generic** and reusable.
- Keep **content modeling** and **layout primitives** here.
- Avoid **client-specific** business rules and integrations; add those in derived repos.

---

## Legacy project initialization

`scripts/init-template.sh` remains available for legacy copy-based consumers. New applications should install a tagged package release instead.

```bash
bash scripts/init-template.sh --install
```

---

## Sanity setup checklist

- `.env.local`: `CMS_PROVIDER=sanity`, `SANITY_PROJECT_ID`, `SANITY_DATASET`, and tokens as needed (see `.env.example`).
- `npm run sanity:dev` — local Studio, or use a deployed Studio URL for QA/production (`ADMIN_NAV_URL`).
- **Videos on CDN:** `npm run upload:videos` (writes `content/hosted-videos.json` from MP4s in `public/`).
- **Seed pages from mock:** `npm run seed:sanity` — creates `siteSettings` + `page` documents (`home`, `about`, `work`, `contact`) with gallery images and HTTPS video URLs. Re-run after editing `content/mock/pages.json`. Seed one page: `npm run seed:sanity -- --only work`.
- Open Studio → confirm documents → **Publish** if your dataset uses drafts.
- Restart `npm run dev` and load `/` or `/#work`.

### Production (e.g. Vercel)

Set in the hosting dashboard (Production + Preview):

| Variable | Production example |
|----------|-------------------|
| `CMS_PROVIDER` | `sanity` |
| `SANITY_PROJECT_ID` | your project id |
| `SANITY_DATASET` | `production` (preview: `staging` if you use it) |
| `SANITY_API_READ_TOKEN` | optional; required for private datasets |
| `SANITY_USE_CDN` | `true` |
| `ADMIN_NAV_URL` | `https://your-studio.sanity.studio` |
| `SITE_ENV` | `production` (preview: `qa`) |

Do not set `SANITY_API_WRITE_TOKEN` on Vercel—use it locally only for `upload:videos` and `seed:sanity`.

### GitHub Pages

Static hosting via `.github/workflows/deploy-github-pages.yml` (runs on push to `main` and manual dispatch).

1. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Merge to `main`; the workflow builds a static export and publishes `out/`.
3. Project site URL: `https://<user>.github.io/<repo>/` (base path defaults to the repo name).

**Repository variables** (optional):

| Variable | Default | Purpose |
|----------|---------|---------|
| `CMS_PROVIDER` | `mock` | `mock` or `sanity` |
| `NEXT_PUBLIC_BASE_PATH` | `/<repo>` | Set to empty for a custom domain at `/` |
| `SANITY_DATASET` | `production` | Sanity dataset |
| `ADMIN_NAV_URL` | — | Link for Admin nav to hosted Studio |

**Secrets** (when using Sanity): `SANITY_PROJECT_ID`, `SANITY_API_READ_TOKEN`.

**Admin nav:** Shows **Admin** → `/admin` with Studio setup notes. To open hosted Sanity Studio directly from the header, set repository variable `ADMIN_NAV_URL` to your `*.sanity.studio` URL and redeploy.

Local static export preview:

```bash
NEXT_PUBLIC_BASE_PATH=/portfolio-core npm run build:pages
npx serve out
```

---

## Tips

- Prefer env vars for secrets; never commit `.env*` files with secrets. See `.gitignore`.
- Remove unused examples before publishing a derived site.

---

## License

MIT. See [`LICENSE`](LICENSE).
