import type { Locale } from "@/lib/site";
import { en } from "./en";
import { fr } from "./fr";
import type { Dictionary } from "./types";

export { defaultLocale, isLocale, locales, type Locale } from "@/lib/site";
export type { Dictionary } from "./types";

const dictionaries: Record<Locale, Dictionary> = { fr, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
