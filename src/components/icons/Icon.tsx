import type { ReactNode } from "react";

export type IconProps = {
  size?: number;
  strokeWidth?: number;
  className?: string;
};

type IconBaseProps = IconProps & { children: ReactNode };

/** Line icon on a 24px grid. Icons are always decorative: the text next to them names the action. */
export function Icon({ size = 24, strokeWidth = 2.2, className, children }: IconBaseProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}
