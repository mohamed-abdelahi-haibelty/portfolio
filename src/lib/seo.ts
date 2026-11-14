import type { Metadata } from "next";
import type { Dictionary } from "@/content/types";
import { EMAIL, PHONE_E164, whatsappHref } from "./contact";
import { defaultLocale, locales, type Locale } from "./site";

export const PERSON_NAME = "Mohamed Abdellahi Haibelty";
export const PERSON_ALTERNATE_NAME = "M. Abdellahi Haibelty";

const ogLocales: Record<Locale, string> = { fr: "fr_FR", en: "en_US" };

/** Only Vercel production is indexable; previews and local builds are noindex. */
export function isIndexable(env: { VERCEL_ENV?: string | undefined }): boolean {
  return env.VERCEL_ENV === "production";
}

/** Locale paths for `alternates.languages`, with `x-default` on the default locale. */
export function languageAlternates(): Record<Locale | "x-default", string> {
  const languages = Object.fromEntries(locales.map((l) => [l, `/${l}`])) as Record<Locale, string>;
  return { ...languages, "x-default": `/${defaultLocale}` };
}

type MetadataInput = {
  locale: Locale;
  dict: Pick<Dictionary, "seo" | "logo">;
  siteUrl: string;
  indexable: boolean;
};

/** Per-locale metadata for `/[locale]`. The OG image comes from `opengraph-image.tsx`. */
export function buildMetadata({ locale, dict, siteUrl, indexable }: MetadataInput): Metadata {
  const { title, description } = dict.seo;
  const path = `/${locale}`;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: { canonical: path, languages: languageAlternates() },
    openGraph: {
      type: "website",
      url: path,
      siteName: dict.logo.text,
      title,
      description,
      locale: ogLocales[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocales[l]),
    },
    twitter: { card: "summary_large_image", title, description },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
  };
}

type JsonLdInput = {
  locale: Locale;
  dict: Pick<Dictionary, "seo" | "logo" | "contact">;
  siteUrl: string;
};

/** The schema.org graph for the home page: Person, ProfessionalService, WebSite. */
export function buildJsonLd({ locale, dict, siteUrl }: JsonLdInput) {
  const url = `${siteUrl}/${locale}`;
  const personId = `${siteUrl}/#person`;
  const address = {
    "@type": "PostalAddress",
    addressLocality: "Nouakchott",
    addressCountry: "MR",
  };
  const languages = ["fr", "en", "ar"];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: PERSON_NAME,
        alternateName: PERSON_ALTERNATE_NAME,
        jobTitle: dict.seo.jobTitle,
        url,
        email: EMAIL,
        telephone: PHONE_E164,
        address,
        knowsAbout: ["Web development", "Web security", "Web performance", "SEO"],
        knowsLanguage: languages,
      },
      {
        "@type": "ProfessionalService",
        "@id": `${siteUrl}/#service`,
        name: dict.logo.text,
        url,
        description: dict.seo.description,
        areaServed: "Worldwide",
        address,
        telephone: PHONE_E164,
        email: EMAIL,
        founder: { "@id": personId },
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "WhatsApp",
            url: whatsappHref(dict.contact.whatsapp.message),
            availableLanguage: languages,
          },
          {
            "@type": "ContactPoint",
            contactType: "phone",
            telephone: PHONE_E164,
            availableLanguage: languages,
          },
          {
            "@type": "ContactPoint",
            contactType: "email",
            email: EMAIL,
            availableLanguage: languages,
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: dict.logo.text,
        url,
        inLanguage: locale,
      },
    ],
  };
}

/** JSON for a `<script type="application/ld+json">`, with `<` escaped so it cannot close the tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
