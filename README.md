# abdellahi.dev

The personal website of **Mohamed Abdellahi Haibelty**, web developer based in Nouakchott. It is a single static page in French and English that shows how I work and makes it easy to get in touch.

**Live:** [abdellahi.dev](https://abdellahi.dev)

## Highlights

- **Bilingual:** French at `/fr` (default) and English at `/en`. Visitors are sent to their language, and both versions are linked for search engines with `hreflang`.
- **Fast:** every page is prerendered. Fonts are self-hosted and trimmed to the characters the site uses. Lighthouse budgets block a regression before it ships.
- **Secure by default:** strict Content Security Policy, HSTS and the other standard security headers. No forms, no database, no third-party scripts, no cookies.
- **Search-ready:** per-language metadata, Open Graph images, structured data, a sitemap and `robots.txt`.
- **Accessible:** semantic HTML, keyboard navigation and automated axe checks in the end-to-end tests.
- **Privacy-friendly analytics:** cookieless visit statistics, sent through a first-party proxy. No IP address is stored.

## Tech stack

| Area      | Tools                                                |
| --------- | ---------------------------------------------------- |
| Framework | Next.js 16 (App Router, React Compiler), React 19    |
| Language  | TypeScript (strict)                                  |
| Styling   | Tailwind CSS 4, Base UI                              |
| Testing   | Vitest, Testing Library, Playwright, axe-core        |
| Quality   | ESLint, Prettier, Husky + lint-staged, Lighthouse CI |
| Hosting   | Vercel (deployment), Cloudflare (DNS)                |

## Performance budgets

Checked on a local production build with `pnpm lhci` (median of 5 runs, both languages):

| Metric                             | Budget   |
| ---------------------------------- | -------- |
| Performance score                  | ≥ 95     |
| Accessibility, Best Practices, SEO | 100      |
| Largest Contentful Paint           | ≤ 2.2 s  |
| Cumulative Layout Shift            | ≤ 0.02   |
| Total Blocking Time                | ≤ 100 ms |
| JavaScript transferred             | ≤ 150 KB |

## Getting started

Requirements: Node.js 24 (see `.nvmrc`) and pnpm.

```bash
pnpm install
pnpm dev          # http://localhost:3000 (redirects to /fr or /en)
```

## Scripts

| Script                      | Description                                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------------------- |
| `pnpm dev`                  | Development server (Turbopack)                                                                    |
| `pnpm build` / `pnpm start` | Production build / serve it locally                                                               |
| `pnpm typecheck`            | Type checking                                                                                     |
| `pnpm lint` / `pnpm format` | ESLint / Prettier check (`pnpm format:write` fixes formatting)                                    |
| `pnpm test`                 | Unit and component tests (Vitest)                                                                 |
| `pnpm test:e2e`             | Playwright (Chromium + iPhone 13 WebKit). Builds and starts the app, or tests `BASE_URL` when set |
| `pnpm check`                | Typecheck, lint, format and unit tests in one go                                                  |
| `pnpm lhci`                 | Lighthouse budgets on a local production build                                                    |

A pre-commit hook runs ESLint and Prettier on staged files.

## Project structure

```text
src/
├── app/          # Routes, layouts, metadata, sitemap, robots, Open Graph images
├── content/      # All visible text: fr.ts and en.ts
├── sections/     # Page sections (hero, guarantees, method, contact, …)
├── components/   # Buttons, icons, logo and hand-drawn "paper" elements
├── lib/          # SEO, links, contact details, analytics relay
└── proxy.ts      # Language redirect and analytics proxy
tests/e2e/        # Playwright end-to-end tests
```

## Editing the text

Every visible word lives in two files: `src/content/fr.ts` (French) and `src/content/en.ts` (English). Both must keep exactly the same keys; a test fails otherwise.

1. Edit the text in both files.
2. Run `pnpm check` and `pnpm test:e2e` (the end-to-end tests compare the page with these files).
3. Commit and push to `main`. Vercel deploys it to [abdellahi.dev](https://abdellahi.dev) in about a minute.

## Deployment

Vercel builds and deploys production on every push to `main`; a failed build never replaces the live site. Run `pnpm check` and `pnpm test:e2e` before pushing.

No secrets or `.env` files live in this repository. The environment variables (`NEXT_PUBLIC_SITE_URL` and the public analytics key) are set in the Vercel project. DNS for `abdellahi.dev` is on Cloudflare (two `CNAME` records pointing to Vercel, DNS only).

## Contact

Working on a project? Get in touch through [abdellahi.dev](https://abdellahi.dev).
