import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

const colors = {
  highlight: "bg-highlight",
  sky: "bg-sky",
  pink: "bg-pink",
  lime: "bg-lime",
  white: "bg-white",
} as const;

type ScrapProps = {
  children: ReactNode;
  color?: keyof typeof colors;
  rotate?: number;
  className?: string;
};

/** Torn paper scrap with handwritten text, a small tilt and a soft shadow. */
export function Scrap({ children, color = "highlight", rotate = -4, className }: ScrapProps) {
  const style = { rotate: `${rotate}deg` } as CSSProperties;
  return (
    <span className={cn("inline-block drop-shadow-scrap", className)} style={style}>
      <span
        className={cn(
          "block px-3 py-2 font-hand text-[17px] leading-[1.15] font-bold text-ink torn md:px-4 md:py-3 md:text-xl",
          colors[color],
        )}
      >
        {children}
      </span>
    </span>
  );
}
