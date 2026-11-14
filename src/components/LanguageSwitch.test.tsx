import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { en } from "@/content/en";
import { fr } from "@/content/fr";
import { LanguageSwitch } from "./LanguageSwitch";

describe("LanguageSwitch", () => {
  it("on /fr: FR is current, EN links to /en with hreflang and lang", () => {
    render(<LanguageSwitch locale="fr" hash="#contact" labels={fr.nav} />);
    expect(screen.getByRole("group", { name: "Langue" })).toBeInTheDocument();

    const current = screen.getByRole("link", { current: true });
    expect(current).toHaveTextContent("FR");
    expect(current).toHaveAttribute("aria-current", "true");
    expect(current).toHaveAttribute("href", "/fr#contact");

    const other = screen.getByRole("link", { name: "EN Version anglaise" });
    expect(other).toHaveAttribute("href", "/en#contact");
    expect(other).toHaveAttribute("hreflang", "en");
    expect(other).toHaveAttribute("lang", "en");
    expect(other).not.toHaveAttribute("aria-current");
  });

  it("on /en: EN is current, FR links to /fr", () => {
    render(<LanguageSwitch locale="en" labels={en.nav} />);
    expect(screen.getByRole("link", { current: true })).toHaveTextContent("EN");
    const other = screen.getByRole("link", { name: "FR French version" });
    expect(other).toHaveAttribute("href", "/fr");
    expect(other).toHaveAttribute("hreflang", "fr");
  });
});
