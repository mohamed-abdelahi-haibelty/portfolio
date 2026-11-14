import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SketchDev } from "./SketchDev";

describe("SketchDev", () => {
  it("exposes role img with the localized alt text", () => {
    render(<SketchDev alt="Mohamed Abdellahi au travail" width={170} />);
    expect(screen.getByRole("img", { name: "Mohamed Abdellahi au travail" })).toBeInTheDocument();
  });

  it("strokes with currentColor and fills the laptop with the chosen accent", () => {
    const { container } = render(<SketchDev alt="x" width={300} accent="highlight" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("stroke", "currentColor");
    expect(svg?.style.getPropertyValue("--sketch-accent")).toBe("var(--color-highlight)");
    expect(svg).toHaveAttribute("height", "258");
  });
});
