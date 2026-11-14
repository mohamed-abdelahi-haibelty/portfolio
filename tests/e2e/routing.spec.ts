import { expect, test } from "@playwright/test";

test.describe("locale routes", () => {
  for (const locale of ["fr", "en"] as const) {
    test(`/${locale} returns 200 with <html lang="${locale}">`, async ({ page }) => {
      const response = await page.goto(`/${locale}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("h1")).toHaveCount(1);
    });
  }

  test("/xx returns 404", async ({ request }) => {
    const response = await request.get("/xx");
    expect(response.status()).toBe(404);
  });
});

test.describe("/ redirects by Accept-Language", () => {
  const cases = [
    { header: "en-US,en;q=0.9", expected: "/en" },
    { header: "fr-FR", expected: "/fr" },
    { header: undefined, expected: "/fr" },
  ];

  for (const { header, expected } of cases) {
    test(`${header ?? "no header"} → ${expected}`, async ({ playwright, baseURL }) => {
      // A fresh context so the browser's own Accept-Language is not sent.
      const request = await playwright.request.newContext({
        ...(baseURL ? { baseURL } : {}),
        extraHTTPHeaders: header ? { "Accept-Language": header } : {},
      });
      const response = await request.get("/", { maxRedirects: 0 });
      expect(response.status()).toBe(307);
      expect(new URL(response.headers().location ?? "", "http://x").pathname).toBe(expected);
      await request.dispose();
    });
  }
});
