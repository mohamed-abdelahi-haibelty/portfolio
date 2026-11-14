import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { fr } from "@/content/fr";
import { DevBadge } from "@/sections/DevBadge";
import { ButtonPrimary } from "./ButtonPrimary";
import { ButtonSecondary } from "./ButtonSecondary";
import { IdeasWindow } from "./IdeasWindow";

describe("IdeasWindow", () => {
  it("lists the results and hides the window dots and check marks", () => {
    const { container } = render(
      <IdeasWindow label={fr.ideas.windowLabel} items={fr.ideas.result} />,
    );
    expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual(fr.ideas.result);
    expect(screen.getByText("votre projet")).toBeVisible();
    expect(container.querySelectorAll("[aria-hidden='true']")).toHaveLength(4);
  });
});

describe("DevBadge", () => {
  it("shows the character with its alt text and the badge text", () => {
    render(<DevBadge {...fr.badge} characterAlt={fr.hero.characterAlt} />);
    expect(screen.getByRole("img", { name: fr.hero.characterAlt })).toBeInTheDocument();
    expect(screen.getByText("PASS DÉVELOPPEUR")).toBeVisible();
    expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual([
      "SÉCURITÉ",
      "VITESSE",
      "SEO",
    ]);
  });
});

describe("buttons", () => {
  it("are links; external ones open in a new tab", () => {
    render(
      <>
        <ButtonPrimary href="#contact">Parlons de votre projet</ButtonPrimary>
        <ButtonSecondary href="https://wa.me/22227117087">WhatsApp</ButtonSecondary>
      </>,
    );
    const primary = screen.getByRole("link", { name: "Parlons de votre projet" });
    expect(primary).toHaveAttribute("href", "#contact");
    expect(primary).not.toHaveAttribute("target");
    const whatsapp = screen.getByRole("link", { name: "WhatsApp" });
    expect(whatsapp).toHaveAttribute("target", "_blank");
    expect(whatsapp).toHaveAttribute("rel", "noopener noreferrer");
  });
});
