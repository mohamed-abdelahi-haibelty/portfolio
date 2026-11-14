import type { CSSProperties, ReactNode } from "react";

type HighlightProps = {
  color?: "lime" | "highlight";
  children: ReactNode;
};

/** Highlighter stroke behind the lower part of the text; wraps across lines. */
export function Highlight({ color = "lime", children }: HighlightProps) {
  const style = { "--hl": `var(--color-${color})` } as CSSProperties;
  return (
    <span className="hl" style={style}>
      {children}
    </span>
  );
}
