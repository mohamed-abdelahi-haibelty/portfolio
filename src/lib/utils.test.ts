import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("keeps a design font-size token next to a colour", () => {
    expect(cn("text-h2 text-ink")).toBe("text-h2 text-ink");
    expect(cn("font-hand text-hand", "text-pen")).toBe("font-hand text-hand text-pen");
  });

  it("still resolves real conflicts", () => {
    expect(cn("text-pen", "text-ink")).toBe("text-ink");
    expect(cn("text-hand", "text-lg")).toBe("text-lg");
  });
});
