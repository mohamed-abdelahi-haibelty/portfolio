import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type PinProps = {
  color?: "pen" | "pin-pink";
  className?: string;
};

/** Round push-pin with a highlight and a drop shadow. Decorative. */
export function Pin({ color = "pen", className }: PinProps) {
  const style = { "--pin": `var(--color-${color})` } as CSSProperties;
  return (
    <span
      aria-hidden="true"
      className={cn("block size-5 rounded-full shadow-pin pin md:size-[22px]", className)}
      style={style}
    />
  );
}
