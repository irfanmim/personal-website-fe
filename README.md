# Personal Website (Frontend)

Source for [irfanmim](https://github.com/irfanmim)'s personal portfolio website — a Vue 3 single-page app with a public-facing site and a small admin dashboard for editing the content.

## Stack

- [Vue 3](https://vuejs.org/) (Composition API) + [Vite](https://vitejs.dev/)
- [Vue Router](https://router.vuejs.org/) (hash history)
- [Axios](https://axios-http.com/) for API calls
- [vuedraggable](https://github.com/SortableJS/vue.draggable.next) for reordering content in the admin editors
- Plain CSS (no framework)

The app talks to a separate Laravel backend for content (hero, about, experience, projects, contact) and admin auth. Without a reachable API it still renders using hardcoded defaults in `src/data/`.

## Project structure

```
src/
├── api/            # Axios client + admin API calls
├── components/      # Public site sections (Hero, About, Skills, Experience, Projects, Contact, NavBar, ...)
├── composables/      # useDarkMode, useActiveSection
├── data/            # Default/fallback content (projects, experience, skills)
├── directives/       # v-reveal scroll-in animation directive
├── router/          # Route definitions + admin auth guard
├── store/           # content.js — reactive content store synced with the API
└── views/
    ├── PublicView.vue, ProjectsView.vue
    └── admin/        # Login, Dashboard, Settings + per-section editors
```

## Getting started

Requires Node 18+.

```bash
npm install
cp .env.example .env   # then set VITE_API_URL to your backend
npm run dev
```

### Available scripts

| Command           | Description                          |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Start the Vite dev server             |
| `npm run build`   | Type-check-free production build to `dist/` |
| `npm run preview` | Preview the production build locally  |

### Environment variables

| Variable        | Description                                              |
| --------------- | --------------------------------------------------------- |
| `VITE_API_URL`  | Base URL of the backend API (no trailing slash), e.g. `https://api.yourdomain.com` |

## Admin dashboard

Visit `/#/admin/login` to sign in. Authenticated requests use a JWT stored in `localStorage` (`admin_jwt`) and attached as a `Bearer` token via the Axios client. `/admin` and `/admin/settings` are guarded routes that redirect to the login page when no token is present.

The dashboard has editors for the Hero, About, Experience, Projects, and Contact sections, all backed by `src/store/content.js`.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy-static.yml`, which builds the app (`VITE_API_URL` from the `API_URL` repo secret) and pushes the `dist/` output to a separate static-hosting repository using the `STATIC_REPO_TOKEN` secret.
