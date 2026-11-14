import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StickerProps = {
  children: ReactNode;
  className?: string;
};

/** Round pink sticker with handwritten text, tilted −12°. */
export function Sticker({ children, className }: StickerProps) {
  return (
    <span
      className={cn(
        "grid size-[104px] -rotate-12 place-items-center rounded-full border-3 border-ink bg-pink p-3 text-center font-hand text-lg leading-none font-bold text-ink md:size-[150px] md:p-5 md:text-2xl md:leading-[1.05]",
        className,
      )}
    >
      {children}
    </span>
  );
}
