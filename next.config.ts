import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const onVercel = process.env.VERCEL === "1";

/**
 * Static pages cannot carry a per-request nonce, so scripts allow 'unsafe-inline'
 * for Next's inline bootstrap. 'unsafe-eval' only in dev (React's debug stacks).
 * 'upgrade-insecure-requests' only on Vercel (always HTTPS): WebKit applies it to
 * http://localhost too, which breaks every asset of a local production build.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  "object-src 'none'",
  ...(onVercel ? ["upgrade-insecure-requests"] : []),
].join("; ");

/** `performance-seo.md` → Security headers. */
const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactCompiler: true,
  typedRoutes: true,
  // Visit statistics (public/stats.js) post to this origin; Vercel forwards them
  // to PostHog EU, so the browser never contacts another origin.
  rewrites() {
    return Promise.resolve([
      { source: "/ingest/:path*", destination: "https://eu.i.posthog.com/:path*" },
    ]);
  },
  headers() {
    return Promise.resolve([{ source: "/:path*", headers: securityHeaders }]);
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
