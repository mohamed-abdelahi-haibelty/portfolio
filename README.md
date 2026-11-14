# abdellahi.dev

The personal site of Mohamed Abdellahi Haibelty, web developer. It is one static page in French (`/fr`, the default) and English (`/en`), and its only goal is to get visitors in touch.

## Run it

You need Node 24 (see `.nvmrc`) and pnpm.

```bash
pnpm install
pnpm dev          # http://localhost:3000 (redirects to /fr or /en)
```

## Scripts

| Script | Does |
| --- | --- |
| `pnpm dev` | Dev server (Turbopack) |
| `pnpm build` / `pnpm start` | Production build / serve it locally |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` / `pnpm format` | ESLint / Prettier check (`pnpm format:write` fixes formatting) |
| `pnpm test` | Vitest unit and component tests |
| `pnpm test:e2e` | Playwright (Chromium + iPhone 13 WebKit). Builds and starts the app, or tests `BASE_URL` when set |
| `pnpm check` | typecheck + lint + format + unit tests |

A pre-commit hook runs ESLint and Prettier on staged files.

## Where the specs live

- `CLAUDE.md`: rules for every build session.
- `context/`: what to build and how: overview, copy (`content.md`), architecture, design system, performance and SEO, code standards, testing strategy, tooling, and the progress tracker.
- `tasks/`: the five ordered task files (`tasks/README.md` is the index).
- `design/`: the approved screens (HTML and PNG), the brand sheet and the character SVG.

## Deployment

Vercel's Git integration deploys a preview for every pull request and deploys production on every merge to `main`. CI (`.github/workflows/ci.yml`) must pass before a PR can merge. No secrets and no `.env` files live in this repository; the only environment variable, `NEXT_PUBLIC_SITE_URL`, is set in the Vercel project.
