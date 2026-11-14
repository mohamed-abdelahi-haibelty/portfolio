import { test } from "@playwright/test";

/*
 * Visual record, not a pixel diff: full-page screenshots of both locales at
 * the five reference widths, attached to the run for comparison with the
 * approved screens.
 */
test.describe("screenshots", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "one browser is enough for the record",
  );

  for (const locale of ["fr", "en"] as const) {
    for (const width of [360, 390, 768, 1280, 1440]) {
      test(`/${locale} at ${width}px`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`/${locale}`);
        await page.evaluate(() => document.fonts.ready);
        await testInfo.attach(`${locale}-${width}.png`, {
          body: await page.screenshot({ fullPage: true }),
          contentType: "image/png",
        });
      });
    }
  }
});
