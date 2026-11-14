import type { Metadata, Viewport } from "next";
import { getDictionary, locales } from "@/content";
import { notFoundLocaleScript } from "@/lib/not-found";
import { NotFound } from "@/sections/NotFound";
import { fontVariables } from "./fonts";
import "./globals.css";

/**
 * Every unmatched URL (`/xx`, `/en/missing`, …) gets this static page with a
 * 404 status. The root layout is the dynamic `[locale]` segment, so a plain
 * `not-found.tsx` would have no layout to render in (Next 16 docs →
 * global-not-found). French by default; the head script switches to English
 * under `/en`.
 */
const fr = getDictionary("fr");
const en = getDictionary("en");

/** Next adds `<meta name="robots" content="noindex">` to every 404 itself. */
export const metadata: Metadata = { title: fr.notFound.title };

/** `--color-paper`: the meta tag cannot read the CSS token. */
export const viewport: Viewport = { themeColor: "#FCFCFA" };

export default function GlobalNotFound() {
  return (
    <html lang="fr" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: notFoundLocaleScript(en.notFound.title) }} />
      </head>
      <body className="min-h-dvh paper antialiased">
        <main className="flex min-h-dvh items-center justify-center px-5 py-16">
          {locales.map((locale) => {
            const dict = getDictionary(locale);
            return (
              <NotFound
                key={locale}
                locale={locale}
                t={dict.notFound}
                characterAlt={dict.hero.characterAlt}
              />
            );
          })}
        </main>
      </body>
    </html>
  );
}
