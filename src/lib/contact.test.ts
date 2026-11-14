import { describe, expect, it } from "vitest";
import { contactLinks, emailDisplay, formatPhone, phoneDisplay, whatsappHref } from "./contact";

const fr = "Bonjour Mohamed, j’ai un projet en tête :";
const en = "Hi Mohamed, I have a project in mind:";

describe("contact links", () => {
  it("WhatsApp: wa.me with the number and the encoded prefilled message", () => {
    expect(whatsappHref(fr)).toBe(
      "https://wa.me/22227117087?text=Bonjour%20Mohamed%2C%20j%E2%80%99ai%20un%20projet%20en%20t%C3%AAte%C2%A0%3A",
    );
    expect(whatsappHref(en)).toBe(
      "https://wa.me/22227117087?text=Hi%20Mohamed%2C%20I%20have%20a%20project%20in%20mind%3A",
    );
  });

  it("the message round-trips through the URL", () => {
    expect(new URL(whatsappHref(fr)).searchParams.get("text")).toBe(fr);
  });

  it("phone and email links and display values are exact", () => {
    expect(contactLinks(en)).toEqual({
      whatsapp: {
        href: "https://wa.me/22227117087?text=Hi%20Mohamed%2C%20I%20have%20a%20project%20in%20mind%3A",
        display: "+222 27 11 70 87",
      },
      phone: { href: "tel:+22227117087", display: "+222 27 11 70 87" },
      email: {
        href: "mailto:mohamed.abdelahi.haibelti@gmail.com",
        display: "mohamed.abdelahi.haibelti@gmail.com",
      },
    });
    expect(phoneDisplay).toBe("+222 27 11 70 87");
    expect(emailDisplay).toBe("mohamed.abdelahi.haibelti@gmail.com");
  });

  it("formats a Mauritanian E.164 number in pairs", () => {
    expect(formatPhone("+22227117087")).toBe("+222 27 11 70 87");
  });
});
