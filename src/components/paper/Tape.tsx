import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

const tapes = {
  highlight: { color: "var(--color-highlight)", alpha: "90%" },
  sky: { color: "var(--color-sky)", alpha: "85%" },
  pink: { color: "var(--color-pink)", alpha: "80%" },
} as const;

type TapeProps = {
  color?: keyof typeof tapes;
  rotate?: number;
  /** Text written on the tape (the hero hello label). Without it the strip is decorative. */
  children?: ReactNode;
  className?: string;
};

/** Translucent tape strip with zig-zag ends. */
export function Tape({ color = "highlight", rotate = -3, children, className }: TapeProps) {
  const style = {
    "--tape": tapes[color].color,
    "--tape-alpha": tapes[color].alpha,
    rotate: `${rotate}deg`,
  } as CSSProperties;

  if (children === undefined) {
    return <span aria-hidden="true" className={cn("block tape", className)} style={style} />;
  }

  return (
    <span
      className={cn(
        "inline-block px-4 py-1.5 font-hand text-hello font-bold text-ink tape md:px-6 md:py-2",
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}
