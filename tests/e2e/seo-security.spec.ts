import { expect, test } from "@playwright/test";

// E2E_TARGET=production: the live site, which must be indexable.
// E2E_SITE_URL: the canonical origin when it differs from BASE_URL (e.g. testing
// the vercel.app URL once the custom domain is the canonical one).
const onProduction = process.env.E2E_TARGET === "production";
const locales = ["fr", "en"] as const;

function siteUrlFor(baseURL: string | undefined): string {
  return (process.env.E2E_SITE_URL ?? baseURL ?? "http://localhost:3000").replace(/\/+$/, "");
}

const csp =
  "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'none'; object-src 'none'";

// Deployed (HTTPS) builds add upgrade-insecure-requests; local http builds cannot (see next.config.ts).
const overHttps = (process.env.BASE_URL ?? "").startsWith("https://");

const expectedHeaders: Record<string, string> = {
  "content-security-policy": overHttps ? `${csp}; upgrade-insecure-requests` : csp,
  "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  "x-frame-options": "DENY",
  "cross-origin-opener-policy": "same-origin",
};

/** Width and height from a PNG's IHDR chunk. */
function pngSize(buffer: Buffer): { width: number; height: number } {
  expect(buffer.subarray(1, 4).toString("ascii")).toBe("PNG");
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

for (const locale of locales) {
  test.describe(`SEO and security on /${locale}`, () => {
    test("canonical and hreflang alternates are absolute", async ({ page, baseURL }) => {
      const site = siteUrlFor(baseURL);
      await page.goto(`/${locale}`);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `${site}/${locale}`,
      );
      for (const [lang, path] of [
        ["fr", "/fr"],
        ["en", "/en"],
        ["x-default", "/fr"],
      ]) {
        await expect(page.locator(`link[rel="alternate"][hreflang="${lang}"]`)).toHaveAttribute(
          "href",
          `${site}${path}`,
        );
      }
    });

    test("robots meta follows the environment", async ({ page }) => {
      await page.goto(`/${locale}`);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        "content",
        onProduction ? "index, follow" : "noindex, nofollow",
      );
    });

    test("Open Graph: localized text and a 1200×630 PNG image", async ({ page, request }) => {
      await page.goto(`/${locale}`);
      const title = await page.title();
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", title);
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
        "content",
        locale === "fr" ? "fr_FR" : "en_US",
      );
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
        "content",
        "summary_large_image",
      );
      const description = await page.locator('meta[name="description"]').getAttribute("content");
      await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
        "content",
        description ?? "",
      );

      const imageUrl = await page.locator('meta[property="og:image"]').getAttribute("content");
      expect(imageUrl).toContain(`/${locale}/opengraph-image`);
      // The absolute URL uses the canonical origin; fetch it from the server under test.
      const { pathname, search } = new URL(imageUrl ?? "");
      const response = await request.get(pathname + search);
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toBe("image/png");
      expect(pngSize(await response.body())).toEqual({ width: 1200, height: 630 });
    });

    test("JSON-LD graph parses and holds the contact values", async ({ page }) => {
      await page.goto(`/${locale}`);
      const scripts = page.locator('script[type="application/ld+json"]');
      await expect(scripts).toHaveCount(1);
      const data = JSON.parse((await scripts.textContent()) ?? "") as {
        "@graph": { "@type": string; name?: string; telephone?: string; email?: string }[];
      };
      const person = data["@graph"].find((node) => node["@type"] === "Person");
      expect(person).toMatchObject({
        name: "Mohamed Abdellahi Haibelty",
        telephone: "+22227117087",
        email: "mohamed.abdelahi.haibelti@gmail.com",
      });
      expect(data["@graph"].map((node) => node["@type"])).toEqual([
        "Person",
        "ProfessionalService",
        "WebSite",
      ]);
    });

    test("every security header is present with its value", async ({ request }) => {
      const response = await request.get(`/${locale}`);
      expect(response.status()).toBe(200);
      const headers = response.headers();
      for (const [name, value] of Object.entries(expectedHeaders)) {
        expect(headers[name], name).toBe(value);
      }
      expect(headers["x-powered-by"]).toBeUndefined();
    });

    test("loads nothing from another origin and logs no console error or CSP violation", async ({
      page,
      baseURL,
    }) => {
      const origin = new URL(baseURL ?? "http://localhost:3000").origin;
      const foreign: string[] = [];
      const errors: string[] = [];
      page.on("request", (req) => {
        const url = new URL(req.url());
        if (url.protocol.startsWith("http") && url.origin !== origin) foreign.push(url.href);
      });
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      page.on("pageerror", (error) => {
        errors.push(error.message);
      });
      await page.addInitScript(() => {
        const violations: string[] = [];
        Object.assign(window, { __cspViolations: violations });
        document.addEventListener("securitypolicyviolation", (event) => {
          violations.push(`${event.violatedDirective} ${event.blockedURI}`);
        });
      });

      await page.goto(`/${locale}`, { waitUntil: "networkidle" });
      // Exercise the client code too (the mobile menu, hydrated by Next's runtime).
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await page.waitForLoadState("networkidle");

      const violations = await page.evaluate(
        () => (window as unknown as { __cspViolations: string[] }).__cspViolations,
      );
      expect(foreign).toEqual([]);
      expect(errors).toEqual([]);
      expect(violations).toEqual([]);
    });
  });
}

test.describe("crawl files", () => {
  test("sitemap.xml lists both URLs with their alternates", async ({ request, baseURL }) => {
    const site = siteUrlFor(baseURL);
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const xml = await response.text();

    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(urls).toEqual([`${site}/fr`, `${site}/en`]);
    for (const [lang, path] of [
      ["fr", "/fr"],
      ["en", "/en"],
      ["x-default", "/fr"],
    ]) {
      const link = `<xhtml:link rel="alternate" hreflang="${lang}" href="${site}${path}" />`;
      expect(xml.split(link).length - 1, link).toBe(2);
    }
    expect(xml.match(/<lastmod>/g)).toHaveLength(2);
    expect(xml).not.toContain("_gallery");
  });

  test("robots.txt follows the environment", async ({ request, baseURL }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const body = await response.text();
    if (onProduction) {
      expect(body).toContain("User-Agent: *\nAllow: /");
      expect(body).toContain(`Sitemap: ${siteUrlFor(baseURL)}/sitemap.xml`);
      expect(body).not.toContain("Disallow");
    } else {
      expect(body).toContain("User-Agent: *\nDisallow: /");
      expect(body).not.toContain("Allow: /");
    }
  });

  test("crawl files carry the security headers too", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.headers()["x-content-type-options"]).toBe("nosniff");
    expect(response.headers()["strict-transport-security"]).toBe(
      expectedHeaders["strict-transport-security"],
    );
  });
});
