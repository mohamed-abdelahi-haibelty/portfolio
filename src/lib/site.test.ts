import { describe, expect, it } from "vitest";
import { isLocale, localeFromAcceptLanguage, resolveSiteUrl } from "./site";

describe("isLocale", () => {
  it("accepts fr and en", () => {
    expect(isLocale("fr")).toBe(true);
    expect(isLocale("en")).toBe(true);
  });

  it.each(["", "xx", "FR", "en-US", "fr-FR", "de", " fr"])("rejects %j", (value) => {
    expect(isLocale(value)).toBe(false);
  });
});

describe("localeFromAcceptLanguage", () => {
  it.each([
    ["en-US,en;q=0.9", "en"],
    ["en", "en"],
    ["en-GB,fr;q=0.5", "en"],
    ["de-DE,en;q=0.8,fr;q=0.7", "en"],
    ["fr-FR", "fr"],
    ["fr-FR,fr;q=0.9,en;q=0.8", "fr"],
    ["en;q=0.5,fr;q=0.5", "fr"],
    ["en;q=0", "fr"],
    ["de-DE", "fr"],
    ["*", "fr"],
    ["", "fr"],
  ] as const)("%j → %s", (header, expected) => {
    expect(localeFromAcceptLanguage(header)).toBe(expected);
  });

  it("defaults to fr with no header", () => {
    expect(localeFromAcceptLanguage(null)).toBe("fr");
  });
});

describe("resolveSiteUrl", () => {
  it("uses NEXT_PUBLIC_SITE_URL without a trailing slash", () => {
    expect(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: "https://abdellahi.dev/",
        VERCEL_URL: "x.vercel.app",
      }),
    ).toBe("https://abdellahi.dev");
  });

  it("falls back to the Vercel deployment URL on previews", () => {
    expect(resolveSiteUrl({ VERCEL_URL: "preview-abc.vercel.app" })).toBe(
      "https://preview-abc.vercel.app",
    );
  });

  it("falls back to localhost", () => {
    expect(resolveSiteUrl({})).toBe("http://localhost:3000");
  });
});
