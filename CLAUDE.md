# personal-website-fe

Vue 3 (Composition API) + Vite SPA for irfanmim's personal portfolio site, including a
small `/#/admin` dashboard for editing content. Talks to the sibling repo
`../personal-website-be` (Laravel API) — see the workspace root CLAUDE.md for how the
two fit together.

## Setup
- `npm install`
- `cp .env.example .env` and set `VITE_API_URL` (no trailing slash, include scheme)
- `npm run dev` — requires Node 18+
- Full-stack local dev: bring the app up via the backend repo's `docker compose up`
  instead, which auto-sets `VITE_API_URL=http://localhost:8000` and serves this app on
  :5173 (requires this repo checked out as `../personal-website-fe` relative to the
  backend, or `$FRONTEND_PATH` set).

## Scripts
- `npm run dev`, `npm run build`, `npm run preview` — that's all that's defined.
- **No test runner and no lint/format tooling configured in this repo** (no Vitest/
  Jest/Cypress, no ESLint/Prettier config). Don't assume `npm run lint` or `npm test`
  exist.

## Structure
- `src/api/` — axios client (`client.js`, baseURL = `VITE_API_URL`) + admin API calls.
  Individual calls include the `/api` prefix themselves, e.g.
  `client.put('/api/admin/username', ...)`.
- `src/components/` — public site sections (Hero, About, Skills, Experience, Projects,
  Contact, NavBar)
- `src/composables/`, `src/store/content.js` — reactive content store
- `src/data/` — hardcoded fallback content rendered if the API is unreachable
- `src/router/` — hash-history routing (`createWebHashHistory`), admin auth guard
- `src/views/` + `src/views/admin/` — public views and admin login/dashboard/settings

## Auth / routing
- Routes: `/`, `/projects`, `/admin/login`, `/admin` (guarded), `/admin/settings`
  (guarded, lazy-loaded), catch-all → `/`.
- Guard checks only whether `localStorage.getItem('admin_jwt')` is present — no
  client-side expiry/validation of the token itself.

## Deployment
- Push to `main` → `.github/workflows/deploy-static.yml` → builds with `VITE_API_URL`
  from the `API_URL` repo secret → pushes `dist/` to a separate static-hosting repo
  (`irfanmim/personal-website-fe-static`) using `STATIC_REPO_TOKEN`.
