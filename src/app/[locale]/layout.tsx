import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales } from "@/content";
import { buildMetadata, isIndexable } from "@/lib/seo";
import { analyticsKey, SITE_URL } from "@/lib/site";
import { fontVariables } from "../fonts";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return buildMetadata({
    locale,
    dict: getDictionary(locale),
    siteUrl: SITE_URL,
    indexable: isIndexable({ VERCEL_ENV: process.env.VERCEL_ENV }),
  });
}

/** `--color-paper`: the meta tag cannot read the CSS token. */
export const viewport: Viewport = { themeColor: "#FCFCFA" };

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const statsKey = analyticsKey({
    VERCEL_ENV: process.env.VERCEL_ENV,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  });

  return (
    <html lang={locale} className={fontVariables}>
      <body className="min-h-dvh paper antialiased">
        {children}
        {statsKey && <script src="/stats.js" data-key={statsKey} defer />}
      </body>
    </html>
  );
}
