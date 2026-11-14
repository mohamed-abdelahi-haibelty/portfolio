import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { en } from "@/content/en";
import { fr } from "@/content/fr";
import { Guarantees } from "./Guarantees";
import { Hero } from "./Hero";

const locales = [
  ["fr", fr],
  ["en", en],
] as const;

describe.each(locales)("sections in %s", (_locale, dict) => {
  it("Hero renders exactly one h1, with the full title", () => {
    render(<Hero t={dict.hero} badge={dict.badge} whatsappHref="https://wa.me/22227117087" />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    const { start, highlight, afterHighlight, circle, afterCircle, wavy, end } = dict.hero.title;
    expect(headings[0]).toHaveTextContent(
      [start, highlight, afterHighlight, circle, afterCircle, wavy, end].join(""),
      { normalizeWhitespace: false },
    );
  });

  it("Hero buttons go to the contact block and to WhatsApp in a new tab", () => {
    render(<Hero t={dict.hero} badge={dict.badge} whatsappHref="https://wa.me/22227117087" />);
    expect(screen.getByRole("link", { name: dict.hero.ctaPrimary })).toHaveAttribute(
      "href",
      "#contact",
    );
    const whatsapp = screen.getByRole("link", { name: dict.hero.ctaWhatsapp });
    expect(whatsapp).toHaveAttribute("target", "_blank");
    expect(whatsapp).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("Guarantees renders four items with their titles", () => {
    render(<Guarantees t={dict.guarantees} />);
    const section = screen.getByRole("region", { name: dict.guarantees.title });
    const items = within(section).getAllByRole("listitem");
    expect(items).toHaveLength(4);
    expect(
      items.map((item) => within(item).getByRole("heading", { level: 3 }).textContent),
    ).toEqual(dict.guarantees.items.map((item) => item.title));
  });
});
