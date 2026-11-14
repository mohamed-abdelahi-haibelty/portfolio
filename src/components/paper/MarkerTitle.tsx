import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

const colors = {
  highlight: "bg-highlight",
  sky: "bg-sky",
} as const;

type MarkerTitleProps = {
  children: ReactNode;
  color?: keyof typeof colors;
  /** Degrees; the design uses −1.5 for yellow and 1.5 for sky. */
  rotate?: number;
  id?: string;
  className?: string;
};

/** A real `<h2>` set on a tilted block of marker colour. */
export function MarkerTitle({
  children,
  color = "highlight",
  rotate = -1.5,
  id,
  className,
}: MarkerTitleProps) {
  const style = { rotate: `${rotate}deg` } as CSSProperties;
  return (
    <h2
      id={id}
      className={cn("font-display text-h2 leading-[1.08] font-extrabold text-ink", className)}
    >
      <span
        className={cn("inline-block marker px-3 py-0.5 md:px-[18px]", colors[color])}
        style={style}
      >
        {children}
      </span>
    </h2>
  );
}
