import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { contactLinks } from "@/lib/contact";
import { ContactRow } from "./ContactRow";
import { MailIcon } from "./icons/MailIcon";
import { PhoneIcon } from "./icons/PhoneIcon";
import { WhatsAppIcon } from "./icons/WhatsAppIcon";

const links = contactLinks("Bonjour Mohamed, j’ai un projet en tête :");

describe("ContactRow", () => {
  it("is one link with the given href, showing label and value", () => {
    render(
      <ContactRow
        href={links.phone.href}
        label="Téléphone"
        value={links.phone.display}
        icon={<PhoneIcon />}
      />,
    );
    const link = screen.getByRole("link", { name: "Téléphone +222 27 11 70 87" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "tel:+22227117087");
    expect(link).not.toHaveAttribute("target");
    expect(screen.getByText("Téléphone")).toBeVisible();
    expect(screen.getByText("+222 27 11 70 87")).toBeVisible();
  });

  it("inserts a break opportunity before @ (and after the dots) in an email", () => {
    render(
      <ContactRow
        href={links.email.href}
        label="E-mail"
        value={links.email.display}
        icon={<MailIcon />}
      />,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "mailto:mohamed.abdelahi.haibelti@gmail.com");
    const value = link.querySelector("[data-value]");
    expect(value?.innerHTML).toBe("mohamed.<wbr>abdelahi.<wbr>haibelti<wbr>@gmail.com");
    expect(value).toHaveTextContent("mohamed.abdelahi.haibelti@gmail.com");
  });

  it("opens WhatsApp in a new tab with noopener noreferrer", () => {
    render(
      <ContactRow
        href={links.whatsapp.href}
        label="WhatsApp"
        value={links.whatsapp.display}
        icon={<WhatsAppIcon />}
      />,
    );
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toMatch(/^https:\/\/wa\.me\/22227117087\?text=/);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("hides its icon and arrow from assistive technology", () => {
    const { container } = render(
      <ContactRow href="tel:+22227117087" label="Phone" value="+222" icon={<PhoneIcon />} />,
    );
    const svgs = container.querySelectorAll("svg");
    expect(svgs).toHaveLength(2);
    for (const svg of svgs) expect(svg).toHaveAttribute("aria-hidden", "true");
  });
});
