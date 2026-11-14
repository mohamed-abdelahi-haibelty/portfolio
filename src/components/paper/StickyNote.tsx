import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Pin } from "./Pin";

const colors = {
  highlight: "bg-highlight",
  sky: "bg-sky",
  pink: "bg-pink",
  lime: "bg-lime",
} as const;

type StickyNoteProps = {
  title: string;
  text: string;
  /** A decorative icon from `components/icons`. */
  icon: ReactNode;
  color: keyof typeof colors;
  /** Degrees; the design uses −3, 2, −1.5 and 3 in order. */
  rotate: number;
  pin?: "pen" | "pin-pink";
  className?: string;
};

/**
 * Pinned square note. From 768px: icon tile above the title and a folded
 * bottom-right corner. On mobile: icon inline with the title.
 * Straightens a little on hover.
 */
export function StickyNote({
  title,
  text,
  icon,
  color,
  rotate,
  pin = "pen",
  className,
}: StickyNoteProps) {
  const style = { "--r": `${rotate}deg` } as CSSProperties;
  return (
    <div
      className={cn(
        "relative rotate-(--r) motion-safe:transition-[rotate] motion-safe:duration-200 motion-safe:hover:rotate-[calc(var(--r)*0.4)]",
        className,
      )}
      style={style}
    >
      <Pin color={pin} className="absolute -top-2 left-1/2 z-10 -translate-x-1/2" />
      <div className="h-full drop-shadow-note">
        <div
          className={cn(
            "h-full px-5 pt-[26px] pb-5 text-ink md:min-h-[270px] md:px-6 md:pt-[34px] md:note-fold",
            colors[color],
          )}
        >
          <div className="flex items-center gap-2.5 md:block">
            <span className="flex-none md:grid md:size-12 md:place-items-center md:rounded-tile md:border-[2.5px] md:border-ink">
              {icon}
            </span>
            <h3 className="font-display text-card font-extrabold md:mt-4">{title}</h3>
          </div>
          <p className="mt-2 font-hand text-sticky">{text}</p>
        </div>
      </div>
    </div>
  );
}
