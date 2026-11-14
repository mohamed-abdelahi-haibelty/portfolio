import { locales, type Locale } from "@/lib/site";
import { cn } from "@/lib/utils";

type LanguageSwitchProps = {
  locale: Locale;
  /** Section to keep when switching, e.g. "#contact". */
  hash?: string;
  /** `nav.language` (group name) and `nav.switchTo` (screen-reader text on the other link). */
  labels: { language: string; switchTo: string };
  className?: string;
};

/**
 * FR / EN pill. Two plain links (not `next/link`): the mobile menu script
 * copies the current `#section` onto every `[data-keep-hash]` link, and a
 * plain link follows its live `href`. The current one is ink-filled.
 */
export function LanguageSwitch({ locale, hash = "", labels, className }: LanguageSwitchProps) {
  return (
    <div
      role="group"
      aria-label={labels.language}
      className={cn(
        "inline-flex rounded-full border-2 border-ink p-0.5 text-xs font-bold md:p-[3px] md:text-[13px]",
        className,
      )}
    >
      {locales.map((code) => {
        const linkClass =
          "relative rounded-full px-[9px] py-[5px] leading-none before:absolute before:inset-x-0 before:-inset-y-2.5 md:px-[11px] md:py-1.5";
        const href = `/${code}${hash}` as const;

        if (code === locale) {
          return (
            <a
              key={code}
              href={href}
              data-keep-hash
              aria-current="true"
              className={cn(linkClass, "bg-ink text-white")}
            >
              {code.toUpperCase()}
            </a>
          );
        }

        return (
          <a
            key={code}
            href={href}
            data-keep-hash
            hrefLang={code}
            lang={code}
            className={cn(linkClass, "text-ink")}
          >
            {code.toUpperCase()}{" "}
            <span lang={locale} className="sr-only">
              {labels.switchTo}
            </span>
          </a>
        );
      })}
    </div>
  );
}
