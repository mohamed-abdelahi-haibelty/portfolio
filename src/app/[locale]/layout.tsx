import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales } from "@/content";
import { fontVariables } from "../fonts";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: getDictionary(locale).seo.title };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} className={fontVariables}>
      <body className="min-h-dvh paper antialiased">{children}</body>
    </html>
  );
}
