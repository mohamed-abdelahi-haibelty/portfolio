/**
 * Contact details, exactly as in the project brief. Note the spellings:
 * the name is "Abdellahi", the address uses "abdelahi" and "haibelti".
 */
export const PHONE_E164 = "+22227117087";
export const EMAIL = "mohamed.abdelahi.haibelti@gmail.com";

/** "+22227117087" → "+222 27 11 70 87" (country code, then pairs). */
export function formatPhone(e164: string): string {
  const match = /^\+222(\d{8})$/.exec(e164);
  if (!match?.[1]) throw new Error(`Not a Mauritanian E.164 number: ${e164}`);
  return `+222 ${match[1].replace(/(\d{2})(?=\d)/g, "$1 ")}`;
}

export const phoneDisplay = formatPhone(PHONE_E164);
export const emailDisplay = EMAIL;
export const telHref = `tel:${PHONE_E164}`;
export const mailtoHref = `mailto:${EMAIL}`;

/** WhatsApp chat link with a prefilled message (`contact.whatsapp.message`). */
export function whatsappHref(message: string): string {
  return `https://wa.me/${PHONE_E164.slice(1)}?text=${encodeURIComponent(message)}`;
}

export type ContactLink = { href: string; display: string };

export function contactLinks(
  whatsappMessage: string,
): Record<"whatsapp" | "phone" | "email", ContactLink> {
  return {
    whatsapp: { href: whatsappHref(whatsappMessage), display: phoneDisplay },
    phone: { href: telHref, display: phoneDisplay },
    email: { href: mailtoHref, display: emailDisplay },
  };
}
