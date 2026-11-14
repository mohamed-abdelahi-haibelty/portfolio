import { cn } from "@/lib/utils";
import { LogoMark } from "./LogoMark";

type LogoProps = {
  /** The wordmark text, `site.name` from the dictionary. */
  name: string;
  /** `header`: mark + wordmark, 34/19 px on mobile and 40/24 px from 768 px. `footer`: small wordmark only. */
  variant?: "header" | "footer";
  className?: string;
};

/**
 * Logo lockup. The wordmark is a single run of text in one colour:
 * ".dev" is never styled differently.
 */
export function Logo({ name, variant = "header", className }: LogoProps) {
  if (variant === "footer") {
    return (
      <span
        data-wordmark
        className={cn(
          "font-display text-[15px] leading-none font-extrabold tracking-[-0.03em] text-ink md:text-base",
          className,
        )}
      >
        {name}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-2.5 md:gap-[11px]", className)}>
      <LogoMark size={40} className="size-[34px] md:size-10" />
      <span
        data-wordmark
        className="font-display text-[19px] leading-none font-extrabold tracking-[-0.03em] text-ink md:text-2xl"
      >
        {name}
      </span>
    </span>
  );
}
