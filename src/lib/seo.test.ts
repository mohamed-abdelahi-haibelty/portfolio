import { describe, expect, it } from "vitest";
import { en } from "@/content/en";
import { fr } from "@/content/fr";
import {
  buildJsonLd,
  buildMetadata,
  buildRobots,
  buildSitemap,
  isIndexable,
  serializeJsonLd,
} from "./seo";

const siteUrl = "https://abdellahi.dev";
const dicts = { fr, en } as const;

describe("buildMetadata", () => {
  it.each(["fr", "en"] as const)("%s: title, description and canonical", (locale) => {
    const meta = buildMetadata({ locale, dict: dicts[locale], siteUrl, indexable: true });
    expect(meta.title).toBe(dicts[locale].seo.title);
    expect(meta.description).toBe(dicts[locale].seo.description);
    expect(String(meta.metadataBase)).toBe("https://abdellahi.dev/");
    expect(meta.alternates?.canonical).toBe(`/${locale}`);
  });

  it("languages list both locales and x-default on French", () => {
    const meta = buildMetadata({ locale: "en", dict: en, siteUrl, indexable: true });
    expect(meta.alternates?.languages).toEqual({ fr: "/fr", en: "/en", "x-default": "/fr" });
  });

  it("Open Graph locale and alternate locale", () => {
    const frMeta = buildMetadata({ locale: "fr", dict: fr, siteUrl, indexable: true });
    const enMeta = buildMetadata({ locale: "en", dict: en, siteUrl, indexable: true });
    expect(frMeta.openGraph).toMatchObject({
      type: "website",
      url: "/fr",
      siteName: "abdellahi.dev",
      locale: "fr_FR",
      alternateLocale: ["en_US"],
      title: fr.seo.title,
      description: fr.seo.description,
    });
    expect(enMeta.openGraph).toMatchObject({ locale: "en_US", alternateLocale: ["fr_FR"] });
  });

  it("Twitter uses the large image card", () => {
    const meta = buildMetadata({ locale: "fr", dict: fr, siteUrl, indexable: true });
    expect(meta.twitter).toMatchObject({ card: "summary_large_image", title: fr.seo.title });
  });

  it("robots: index on production, noindex otherwise", () => {
    expect(buildMetadata({ locale: "fr", dict: fr, siteUrl, indexable: true }).robots).toEqual({
      index: true,
      follow: true,
    });
    expect(buildMetadata({ locale: "fr", dict: fr, siteUrl, indexable: false }).robots).toEqual({
      index: false,
      follow: false,
    });
  });
});

describe("isIndexable", () => {
  it("only Vercel production", () => {
    expect(isIndexable({ VERCEL_ENV: "production" })).toBe(true);
    expect(isIndexable({ VERCEL_ENV: "preview" })).toBe(false);
    expect(isIndexable({ VERCEL_ENV: "development" })).toBe(false);
    expect(isIndexable({})).toBe(false);
  });
});

type Node = Record<string, unknown>;

function graph(locale: "fr" | "en"): Node[] {
  const parsed = JSON.parse(
    serializeJsonLd(buildJsonLd({ locale, dict: dicts[locale], siteUrl })),
  ) as { "@context": string; "@graph": Node[] };
  expect(parsed["@context"]).toBe("https://schema.org");
  return parsed["@graph"];
}

function byType(nodes: Node[], type: string): Node {
  const node = nodes.find((n) => n["@type"] === type);
  if (!node) throw new Error(`no ${type}`);
  return node;
}

describe("JSON-LD", () => {
  it.each(["fr", "en"] as const)("%s: Person holds the exact name and contact values", (locale) => {
    const person = byType(graph(locale), "Person");
    expect(person).toMatchObject({
      name: "Mohamed Abdellahi Haibelty",
      alternateName: "M. Abdellahi Haibelty",
      jobTitle: dicts[locale].seo.jobTitle,
      url: `https://abdellahi.dev/${locale}`,
      telephone: "+22227117087",
      email: "mohamed.abdellahi.haibelti@gmail.com",
      address: { addressLocality: "Nouakchott", addressCountry: "MR" },
      knowsLanguage: ["fr", "en", "ar"],
    });
    expect(person.knowsAbout).toHaveLength(4);
  });

  it("ProfessionalService: localized description, founder and contact points", () => {
    const nodes = graph("en");
    const person = byType(nodes, "Person");
    const service = byType(nodes, "ProfessionalService");
    expect(service).toMatchObject({
      name: "abdellahi.dev",
      description: en.seo.description,
      areaServed: "Worldwide",
      founder: { "@id": person["@id"] },
    });
    expect(service.contactPoint).toEqual([
      expect.objectContaining({
        contactType: "WhatsApp",
        url: expect.stringMatching(/^https:\/\/wa\.me\/22227117087\?text=/) as unknown,
      }),
      expect.objectContaining({ contactType: "phone", telephone: "+22227117087" }),
      expect.objectContaining({
        contactType: "email",
        email: "mohamed.abdellahi.haibelti@gmail.com",
      }),
    ]);
  });

  it("WebSite carries the page language", () => {
    expect(byType(graph("fr"), "WebSite")).toMatchObject({
      name: "abdellahi.dev",
      url: "https://abdellahi.dev/fr",
      inLanguage: "fr",
    });
  });

  it("serialization escapes < so the script cannot be closed early", () => {
    expect(serializeJsonLd({ a: "</script>" })).toBe('{"a":"\\u003c/script>"}');
  });
});

describe("buildSitemap", () => {
  it("lists /fr and /en with absolute language alternates and the build date", () => {
    const date = new Date("2026-11-14T00:00:00Z");
    const languages = {
      fr: "https://abdellahi.dev/fr",
      en: "https://abdellahi.dev/en",
      "x-default": "https://abdellahi.dev/fr",
    };
    expect(buildSitemap(siteUrl, date)).toEqual([
      { url: "https://abdellahi.dev/fr", lastModified: date, alternates: { languages } },
      { url: "https://abdellahi.dev/en", lastModified: date, alternates: { languages } },
    ]);
  });
});

describe("buildRobots", () => {
  it("production: allow all and point to the sitemap", () => {
    expect(buildRobots(siteUrl, true)).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: "https://abdellahi.dev/sitemap.xml",
    });
  });

  it("previews: disallow all", () => {
    expect(buildRobots(siteUrl, false)).toEqual({ rules: { userAgent: "*", disallow: "/" } });
  });
});
