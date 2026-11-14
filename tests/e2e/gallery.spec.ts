import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const locale of ["fr", "en"] as const) {
  test.describe(`component gallery (/${locale}/_gallery)`, () => {
    test("has no axe violations", async ({ page }) => {
      await page.goto(`/${locale}/_gallery`);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });

    test("is noindex", async ({ page }) => {
      await page.goto(`/${locale}/_gallery`);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    });

    test("loads nothing from another origin (fonts are self-hosted)", async ({ page, baseURL }) => {
      const origin = new URL(baseURL ?? "http://localhost:3000").origin;
      const foreign: string[] = [];
      page.on("request", (request) => {
        const url = new URL(request.url());
        if (url.protocol.startsWith("http") && url.origin !== origin) foreign.push(url.href);
      });
      await page.goto(`/${locale}/_gallery`, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      expect(foreign).toEqual([]);
    });

    test("at 320px the email contact row does not overflow", async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 800 });
      await page.goto(`/${locale}/_gallery`);
      await page.evaluate(() => document.fonts.ready);
      const row = page.locator('a[href^="mailto:"]');
      const value = row.locator("[data-value]");
      const rowBox = await row.boundingBox();
      const valueBox = await value.boundingBox();
      if (!rowBox || !valueBox) throw new Error("email row not rendered");
      expect(valueBox.x).toBeGreaterThanOrEqual(rowBox.x);
      expect(valueBox.x + valueBox.width).toBeLessThanOrEqual(rowBox.x + rowBox.width);
      const overflows = await value.evaluate((el) => el.scrollWidth > el.clientWidth);
      expect(overflows).toBe(false);
      const pageOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(pageOverflow).toBe(false);
    });
  });
}
