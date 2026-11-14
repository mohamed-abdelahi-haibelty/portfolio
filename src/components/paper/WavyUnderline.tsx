import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type WavyUnderlineProps = {
  children: ReactNode;
  className?: string;
};

/** Pink wavy underline: 4px thick and 8px below on mobile, 5px and 12px from 768px. */
export function WavyUnderline({ children, className }: WavyUnderlineProps) {
  return (
    <span
      className={cn(
        "underline decoration-pink decoration-wavy decoration-4 underline-offset-8 md:decoration-[5px] md:underline-offset-[12px]",
        className,
      )}
    >
      {children}
    </span>
  );
}
