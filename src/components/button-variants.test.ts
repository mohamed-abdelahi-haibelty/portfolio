import { describe, expect, it } from "vitest";
import { buttonVariants as shadcn } from "./ui/button";
import { buttonVariants } from "./button-variants";

describe("button-variants", () => {
  it.each(["primary", "secondary"] as const)("matches ui/button.tsx for %s", (variant) => {
    expect(buttonVariants({ variant })).toBe(shadcn({ variant }));
  });

  it("matches the default variant", () => {
    expect(buttonVariants()).toBe(shadcn());
  });
});
