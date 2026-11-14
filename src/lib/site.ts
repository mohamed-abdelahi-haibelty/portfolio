export const locales = ["fr", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

type SiteEnv = {
  NEXT_PUBLIC_SITE_URL?: string | undefined;
  VERCEL_URL?: string | undefined;
};

/**
 * Production sets NEXT_PUBLIC_SITE_URL. Vercel previews fall back to their
 * own deployment URL, and local runs to localhost.
 */
export function resolveSiteUrl(env: SiteEnv): string {
  if (env.NEXT_PUBLIC_SITE_URL) return env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  VERCEL_URL: process.env.VERCEL_URL,
});

/**
 * Picks the locale for "/" from an Accept-Language header: English when the
 * visitor prefers English over French, French otherwise (including no header).
 */
export function localeFromAcceptLanguage(header: string | null): Locale {
  if (!header) return defaultLocale;

  const quality: Record<Locale, number> = { fr: 0, en: 0 };
  for (const part of header.split(",")) {
    const [rawTag = "", ...params] = part.trim().split(";");
    const language = rawTag.trim().toLowerCase().split("-")[0] ?? "";
    if (!isLocale(language)) continue;

    const qParam = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
    const q = qParam === undefined ? 1 : Number(qParam.slice(2));
    if (Number.isFinite(q) && q > quality[language]) quality[language] = q;
  }

  return quality.en > quality.fr ? "en" : defaultLocale;
}

/** The component gallery (`/[locale]/_gallery`) exists everywhere except Vercel production. */
export function isGalleryEnabled(env: { VERCEL_ENV?: string | undefined }): boolean {
  return env.VERCEL_ENV !== "production";
}
