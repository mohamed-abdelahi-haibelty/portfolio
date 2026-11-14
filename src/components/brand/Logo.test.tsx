import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Logo } from "./Logo";

describe("Logo", () => {
  it.each(["header", "footer"] as const)(
    "%s: the wordmark is one run of text in the display font, one colour",
    (variant) => {
      const { container } = render(<Logo name="abdellahi.dev" variant={variant} />);
      const wordmark = container.querySelector("[data-wordmark]");
      expect(wordmark).toHaveTextContent("abdellahi.dev");
      // No nested element, so ".dev" cannot be styled differently.
      expect(wordmark?.children).toHaveLength(0);
      expect(wordmark).toHaveClass("font-display", "font-extrabold", "text-ink");
    },
  );

  it("hides the mark from assistive technology", () => {
    const { container } = render(<Logo name="abdellahi.dev" />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });
});
