import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PenCircleProps = {
  children: ReactNode;
  className?: string;
};

/** Hand-drawn blue ellipse around a word, open at the top left. Stretches to any word length. */
export function PenCircle({ children, className }: PenCircleProps) {
  return (
    <span className={cn("relative whitespace-nowrap", className)}>
      {children}
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 270 96"
        preserveAspectRatio="none"
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
        className="pointer-events-none absolute -top-[9%] -left-[7%] h-[130%] w-[114%] stroke-pen"
      >
        <path
          d="M30 12 C110 -4 250 4 258 46 C264 88 120 94 40 82 C0 74 -2 30 52 16"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}
