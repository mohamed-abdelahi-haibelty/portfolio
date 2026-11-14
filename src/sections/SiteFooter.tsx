import { Logo } from "@/components/brand/Logo";
import type { Dictionary } from "@/content";
import { cn } from "@/lib/utils";
import { container } from "./layout";

type SiteFooterProps = {
  t: Dictionary["footer"];
  /** The build year: the page is static and rebuilt on every deploy. */
  year: number;
};

export function SiteFooter({ t, year }: SiteFooterProps) {
  return (
    <footer
      className={cn(
        container,
        "mt-[26px] flex flex-col items-center gap-1 pb-[30px] text-[13px] font-medium text-muted md:flex-row md:justify-between md:text-sm lg:mt-[30px] lg:pb-10",
      )}
    >
      <p>{t.copyright.replace("{year}", String(year))}</p>
      <Logo name={t.domain} variant="footer" />
    </footer>
  );
}
