import Link from "next/link";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { Logo } from "@/components/brand/Logo";
import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/site";
import { cn } from "@/lib/utils";
import { container } from "./layout";
import { MobileMenu, type MenuLink } from "./MobileMenu";

type SiteHeaderProps = {
  locale: Locale;
  /** `logo.text`. */
  name: string;
  /** `skip`. */
  skip: string;
  t: Dictionary["nav"];
};

const sections = ["guarantees", "method", "contact"] as const;

/**
 * Logo, section links, language switch and call to action. Under 768px the
 * links and the call to action move into the mobile menu; from 768px to 1023px
 * the call to action is left out so the row fits (the "Contact" link stays).
 */
export function SiteHeader({ locale, name, skip, t }: SiteHeaderProps) {
  const links: MenuLink[] = sections.map((id) => ({ href: `#${id}`, label: t[id] }));
  const cta: MenuLink = { href: "#contact", label: t.cta };

  return (
    <header className={cn(container, "flex items-center justify-between gap-2 pt-[22px] md:pt-7")}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-3 focus:top-3 focus:z-50 focus:rounded-button focus:border-3 focus:border-ink focus:bg-white focus:px-4 focus:py-2.5 focus:font-bold focus:text-ink"
      >
        {skip}
      </a>
      <Link href={`/${locale}`} className="flex-none">
        <Logo name={name} />
      </Link>
      <nav className="hidden md:block">
        <ul className="flex gap-5 text-[15px] font-semibold lg:gap-[34px] lg:text-base">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="inline-flex min-h-11 items-center decoration-2 underline-offset-4 hover:underline"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex items-center gap-2 md:gap-3.5">
        <LanguageSwitch locale={locale} labels={t} />
        <a
          href={cta.href}
          className="hidden min-h-11 items-center rounded-full bg-ink px-[22px] py-3 text-base leading-none font-bold text-white hover:-translate-y-0.5 motion-safe:transition-transform motion-safe:duration-150 lg:inline-flex"
        >
          {cta.label}
        </a>
        <div className="md:hidden">
          <MobileMenu label={t.menu} links={links} cta={cta} />
        </div>
      </div>
    </header>
  );
}
