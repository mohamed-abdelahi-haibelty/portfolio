import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { en } from "../../src/content/en";
import { fr } from "../../src/content/fr";

const dictionaries = { fr, en } as const;

/**
 * WebKit follows Safari's default, where Tab skips links; Option+Tab moves
 * through every link and button, which is what a keyboard user does there.
 */
function tabKey(browserName: string) {
  return browserName === "webkit" ? "Alt+Tab" : "Tab";
}
const other = { fr: "en", en: "fr" } as const;

async function open(page: Page, path: string, width: number) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(path);
  await page.evaluate(() => document.fonts.ready);
}

/** The switch links get the current hash once the page is hydrated. */
function switchLink(page: Page, locale: "fr" | "en") {
  return page
    .getByRole("group", { name: dictionaries[locale].nav.language })
    .locator(`a[hreflang="${other[locale]}"]`);
}

for (const locale of ["fr", "en"] as const) {
  const t = dictionaries[locale];

  test.describe(`home page /${locale}`, () => {
    test("the H1 is the dictionary title", async ({ page }) => {
      await open(page, `/${locale}`, 1280);
      const { start, highlight, afterHighlight, circle, afterCircle, wavy, end } = t.hero.title;
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        [start, highlight, afterHighlight, circle, afterCircle, wavy, end].join(""),
      );
    });

    test("sections appear in the design's order", async ({ page }) => {
      await open(page, `/${locale}`, 1280);
      const ids = await page
        .locator("main > section[id]")
        .evaluateAll((sections) => sections.map((section) => section.id));
      expect(ids).toEqual(["ideas", "guarantees", "method", "contact"]);
    });

    test("nav links and the call to action scroll to their sections", async ({ page }) => {
      await open(page, `/${locale}`, 1280);
      const nav = page.getByRole("banner").getByRole("navigation");
      const targets = [
        [nav.getByRole("link", { name: t.nav.guarantees }), "guarantees"],
        [nav.getByRole("link", { name: t.nav.method }), "method"],
        [nav.getByRole("link", { name: t.nav.contact }), "contact"],
        [page.getByRole("banner").getByRole("link", { name: t.nav.cta }), "contact"],
      ] as const;
      for (const [link, id] of targets) {
        await page.evaluate(() => {
          window.scrollTo({ top: 0, behavior: "instant" });
        });
        await link.click();
        await expect(page).toHaveURL(new RegExp(`/${locale}#${id}$`));
        await expect(page.locator(`#${id} h2`)).toBeInViewport();
      }
    });

    test("the language switch keeps the section", async ({ page }) => {
      await open(page, `/${locale}`, 1280);
      await page.getByRole("banner").getByRole("link", { name: t.nav.contact }).click();
      const link = switchLink(page, locale);
      await expect(link).toHaveAttribute("href", `/${other[locale]}#contact`);
      await link.click();
      await expect(page).toHaveURL(new RegExp(`/${other[locale]}#contact$`));
      await expect(page.locator("html")).toHaveAttribute("lang", other[locale]);
    });

    test("the language switch keeps a section opened by URL", async ({ page }) => {
      await open(page, `/${locale}#method`, 390);
      const link = switchLink(page, locale);
      await expect(link).toHaveAttribute("href", `/${other[locale]}#method`);
    });

    test("contact links have the exact hrefs; WhatsApp opens in a new tab", async ({ page }) => {
      await open(page, `/${locale}`, 1280);
      const contact = page.locator("#contact");
      const whatsapp = contact.locator('a[href^="https://wa.me/"]');
      await expect(whatsapp).toHaveAttribute(
        "href",
        `https://wa.me/22227117087?text=${encodeURIComponent(t.contact.whatsapp.message)}`,
      );
      await expect(whatsapp).toHaveAttribute("target", "_blank");
      await expect(whatsapp).toHaveAttribute("rel", "noopener noreferrer");
      await expect(contact.locator('a[href="tel:+22227117087"]')).toHaveCount(1);
      await expect(
        contact.locator('a[href="mailto:mohamed.abdelahi.haibelti@gmail.com"]'),
      ).toHaveCount(1);
      await expect(contact.getByRole("link")).toHaveCount(3);

      const heroWhatsapp = page.getByRole("link", { name: t.hero.ctaWhatsapp, exact: true });
      await expect(heroWhatsapp).toHaveAttribute(
        "href",
        `https://wa.me/22227117087?text=${encodeURIComponent(t.contact.whatsapp.message)}`,
      );
      await expect(heroWhatsapp).toHaveAttribute("rel", "noopener noreferrer");
    });

    for (const width of [320, 360, 390, 768, 1024, 1280, 1600]) {
      test(`no horizontal overflow at ${width}px; the email stays in its row`, async ({ page }) => {
        await open(page, `/${locale}`, width);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        );
        expect(overflow).toBeLessThanOrEqual(0);

        const row = page.locator('#contact a[href^="mailto:"]');
        const value = row.locator("[data-value]");
        const rowBox = await row.boundingBox();
        const valueBox = await value.boundingBox();
        if (!rowBox || !valueBox) throw new Error("email row not rendered");
        expect(valueBox.x + valueBox.width).toBeLessThanOrEqual(rowBox.x + rowBox.width);
        expect(await value.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(false);
      });
    }

    test("mobile menu: opens by keyboard, traps focus, closes with Escape", async ({
      page,
      browserName,
    }) => {
      await open(page, `/${locale}`, 390);
      const trigger = page.getByRole("button", { name: t.nav.menu });
      await trigger.focus();
      await page.keyboard.press("Enter");
      const dialog = page.getByRole("dialog", { name: t.nav.menu });
      await expect(dialog).toBeVisible();
      for (const name of [t.nav.guarantees, t.nav.method, t.nav.contact, t.nav.cta]) {
        await expect(dialog.getByRole("link", { name })).toBeVisible();
      }

      for (let i = 0; i < 8; i++) {
        await page.keyboard.press(tabKey(browserName));
        // Wrapping passes through Base UI's focus guard, which hands focus back within a frame.
        await expect
          .poll(() => dialog.evaluate((el) => el.contains(document.activeElement)), {
            message: `focus left the menu after ${i + 1} Tab presses`,
            timeout: 1000,
          })
          .toBe(true);
      }

      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
      await expect(trigger).toBeFocused();
    });

    test("mobile menu: a link closes the menu and scrolls to its section", async ({ page }) => {
      await open(page, `/${locale}`, 390);
      await page.getByRole("button", { name: t.nav.menu }).click();
      const dialog = page.getByRole("dialog", { name: t.nav.menu });
      await dialog.getByRole("link", { name: t.nav.method }).click();
      await expect(dialog).toBeHidden();
      await expect(page).toHaveURL(new RegExp(`/${locale}#method$`));
      await expect(page.locator("#method h2")).toBeInViewport();
    });

    test("keyboard: the skip link comes first and every control shows a focus ring", async ({
      page,
      browserName,
    }) => {
      await open(page, `/${locale}`, 1280);
      await page.keyboard.press(tabKey(browserName));
      const skip = page.getByRole("link", { name: t.skip });
      await expect(skip).toBeFocused();
      await expect(skip).toBeInViewport();

      const controls = await page
        .locator("a:visible, button:visible")
        .evaluateAll((elements) => elements.length);
      const seen = new Set<string>();
      for (let i = 0; i < controls + 2; i++) {
        const focus = await page.evaluate(() => {
          const el = document.activeElement;
          if (!(el instanceof HTMLElement) || el === document.body) return null;
          const style = getComputedStyle(el);
          return {
            key: `${el.tagName}|${el.getAttribute("href") ?? ""}|${el.textContent}`,
            outline: style.outlineStyle,
            width: parseFloat(style.outlineWidth),
          };
        });
        if (focus) {
          seen.add(focus.key);
          expect(focus.outline, focus.key).not.toBe("none");
          expect(focus.width, focus.key).toBeGreaterThanOrEqual(3);
        }
        await page.keyboard.press(tabKey(browserName));
      }
      expect(seen.size).toBeGreaterThanOrEqual(controls);
    });

    for (const width of [390, 1280]) {
      test(`axe finds no violations at ${width}px`, async ({ page }) => {
        await open(page, `/${locale}`, width);
        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
      });
    }

    test("never mentions upcoming projects", async ({ page }) => {
      await open(page, `/${locale}`, 1280);
      await expect(page.locator("body")).not.toContainText(/à venir|coming soon|bientôt/i);
    });
  });
}
