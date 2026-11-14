# abdellahi.dev

The personal site of Mohamed Abdellahi Haibelty, web developer. It is one static page in French (`/fr`, the default) and English (`/en`), and its only goal is to get visitors in touch.

Live at **https://abdellahi.dev** (`www.abdellahi.dev` redirects there).

## Run it

You need Node 24 (see `.nvmrc`) and pnpm.

```bash
pnpm install
pnpm dev          # http://localhost:3000 (redirects to /fr or /en)
```

## Scripts

| Script                      | Does                                                                                              |
| --------------------------- | ------------------------------------------------------------------------------------------------- |
| `pnpm dev`                  | Dev server (Turbopack)                                                                            |
| `pnpm build` / `pnpm start` | Production build / serve it locally                                                               |
| `pnpm typecheck`            | `tsc --noEmit`                                                                                    |
| `pnpm lint` / `pnpm format` | ESLint / Prettier check (`pnpm format:write` fixes formatting)                                    |
| `pnpm test`                 | Vitest unit and component tests                                                                   |
| `pnpm test:e2e`             | Playwright (Chromium + iPhone 13 WebKit). Builds and starts the app, or tests `BASE_URL` when set |
| `pnpm check`                | typecheck + lint + format + unit tests                                                            |
| `pnpm lhci`                 | Lighthouse budgets on a local production build                                                    |

A pre-commit hook runs ESLint and Prettier on staged files.

## Change the text

Every visible word lives in two files: `src/content/fr.ts` (French) and `src/content/en.ts` (English). Both must keep exactly the same keys; a test fails otherwise.

1. Edit the text in both files.
2. Run `pnpm check` and `pnpm test:e2e` (the end-to-end tests compare the page with these files).
3. Commit and push to `main`. Vercel deploys it to https://abdellahi.dev in about a minute.

## Deployment

Vercel's Git integration builds production on every push to `main`; a failed build never replaces the live site. Run `pnpm check` and `pnpm test:e2e` before pushing. No secrets and no `.env` files live in this repository; the environment variables (`NEXT_PUBLIC_SITE_URL`, and the public analytics key) are set in the Vercel project. DNS for `abdellahi.dev` is on Cloudflare (two `CNAME` records to Vercel, DNS only).
