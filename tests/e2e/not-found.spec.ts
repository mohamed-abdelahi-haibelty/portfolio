import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { en } from "../../src/content/en";
import { fr } from "../../src/content/fr";

const cases = [
  { path: "/xx", locale: "fr", t: fr.notFound },
  { path: "/fr/page-inconnue", locale: "fr", t: fr.notFound },
  { path: "/enx/missing", locale: "fr", t: fr.notFound },
  { path: "/en/missing-page", locale: "en", t: en.notFound },
  { path: "/en/a/b", locale: "en", t: en.notFound },
] as const;

test.describe("404 page", () => {
  for (const { path, locale, t } of cases) {
    test(`${path} returns 404 with the ${locale} page`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error" && !message.text().includes("404")) {
          errors.push(message.text());
        }
      });
      page.on("pageerror", (error) => {
        errors.push(error.message);
      });

      const response = await page.goto(path);
      expect(response?.status()).toBe(404);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page).toHaveTitle(t.title);

      const h1 = page.getByRole("heading", { level: 1 });
      await expect(h1).toHaveCount(1);
      await expect(h1).toHaveText(t.title);
      await expect(page.getByText(t.text)).toBeVisible();
      await expect(page.getByRole("img")).toHaveCount(1);

      const home = page.getByRole("link", { name: t.cta });
      await expect(home).toHaveCount(1);
      await expect(home).toHaveAttribute("href", `/${locale}`);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
      expect(errors).toEqual([]);

      await home.click();
      await expect(page).toHaveURL(new RegExp(`/${locale}$`));
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
    });
  }

  for (const { path, locale } of [cases[0], cases[3]]) {
    for (const width of [390, 1280]) {
      test(`${path} (${locale}) has no axe violations or overflow at ${width}px`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(path);
        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        );
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }
  }

  test("without JavaScript the 404 is French", async ({ browser, baseURL }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      ...(baseURL ? { baseURL } : {}),
    });
    const page = await context.newPage();
    const response = await page.goto("/en/missing-page");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(fr.notFound.title);
    await context.close();
  });
});
