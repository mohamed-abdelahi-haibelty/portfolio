import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type HandNoteProps = {
  children: ReactNode;
  color?: "pen" | "ink";
  rotate?: number;
  as?: "p" | "span" | "div";
  className?: string;
};

/** Handwritten note in Kalam 700: real text, slightly rotated. */
export function HandNote({
  children,
  color = "pen",
  rotate = -2,
  as: Tag = "p",
  className,
}: HandNoteProps) {
  const style = { rotate: `${rotate}deg` } as CSSProperties;
  return (
    <Tag
      className={cn(
        "font-hand text-hand font-bold",
        color === "pen" ? "text-pen" : "text-ink",
        className,
      )}
      style={style}
    >
      {children}
    </Tag>
  );
}
