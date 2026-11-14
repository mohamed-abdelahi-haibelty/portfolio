import type { CSSProperties } from "react";

type SketchDevProps = {
  /** Localized description, `hero.characterAlt` from the dictionary. */
  alt: string;
  /** Rendered width in px; the height follows the 300×258 drawing. */
  width: number;
  strokeWidth?: number;
  /** Laptop fill: lime in the badge and hero card, yellow on the contact block. */
  accent?: "lime" | "highlight";
  className?: string;
};

/** The line-drawn developer at his laptop. Stroke follows `currentColor`. */
export function SketchDev({
  alt,
  width,
  strokeWidth = 3,
  accent = "lime",
  className,
}: SketchDevProps) {
  const style = { "--sketch-accent": `var(--color-${accent})` } as CSSProperties;

  return (
    <svg
      role="img"
      aria-label={alt}
      width={width}
      height={Math.round((width * 258) / 300)}
      viewBox="0 0 300 258"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      className={className}
    >
      <path d="M40 228 H270" />
      <path d="M70 228 C70 190 92 168 126 164 C150 161 172 168 182 186" />
      <circle cx="132" cy="118" r="30" />
      <path d="M104 106 C110 84 150 80 162 102" />
      <path d="M124 124 q8 6 16 0" />
      <circle cx="122" cy="114" r="2.2" fill="currentColor" />
      <circle cx="144" cy="114" r="2.2" fill="currentColor" />
      <path d="M150 228 L176 168 H262 L238 228 Z" fill="var(--sketch-accent)" />
      <path d="M196 196 l10 -10 M210 204 l18 -18 M212 186 l6 6" />
      <path d="M118 184 C130 200 150 206 170 204" />
    </svg>
  );
}
