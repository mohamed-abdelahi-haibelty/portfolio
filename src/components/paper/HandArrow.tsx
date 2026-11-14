import { cn } from "@/lib/utils";

const arrows = {
  /** Ideas section: loose curve to the right. */
  curve: {
    width: 170,
    height: 90,
    strokeWidth: 3.2,
    d: "M6 56 C50 10 110 6 160 40 M160 40 l-20 -2 M160 40 l-4 -20",
  },
  /** Mobile ideas: curving down. */
  down: {
    width: 40,
    height: 56,
    strokeWidth: 3,
    d: "M10 4 C30 18 30 34 18 50 M18 50 l-2 -14 M18 50 l12 -8",
  },
  /** Hero "fig. 1" note pointing down-left at the badge. */
  diagonal: {
    width: 90,
    height: 80,
    strokeWidth: 2.6,
    d: "M78 6 C60 30 40 50 10 62 M10 62 l16 -14 M10 62 l20 2",
  },
  /** Hero checklist pointing left at the badge. */
  left: { width: 60, height: 40, strokeWidth: 2.6, d: "M54 20 H8 M8 20 l12 -10 M8 20 l12 10" },
} as const;

type HandArrowProps = {
  variant?: keyof typeof arrows;
  color?: "pen" | "ink";
  className?: string;
};

/** Loose hand-drawn arrow with round caps. Decorative. */
export function HandArrow({ variant = "curve", color = "pen", className }: HandArrowProps) {
  const arrow = arrows[variant];
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={arrow.width}
      height={arrow.height}
      viewBox={`0 0 ${arrow.width} ${arrow.height}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={arrow.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(color === "pen" ? "text-pen" : "text-ink", className)}
    >
      <path d={arrow.d} />
    </svg>
  );
}
