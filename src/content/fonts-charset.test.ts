import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { en } from "./en";
import { fr } from "./fr";

// The self-hosted fonts are subset to these characters (scripts/subset-fonts.py).
const { characters } = JSON.parse(
  readFileSync(join(__dirname, "..", "assets", "fonts", "charset.json"), "utf8"),
) as { characters: string };

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (typeof value === "object" && value !== null) return Object.values(value).flatMap(strings);
  return [];
}

describe("font subsets", () => {
  it.each([
    ["fr", fr],
    ["en", en],
  ] as const)("cover every character of the %s copy", (_, dict) => {
    const allowed = new Set(characters);
    const missing = [...new Set(strings(dict).join(""))].filter((char) => !allowed.has(char));
    // A failure here: add the character to CHARSET in scripts/subset-fonts.py and rerun it.
    expect(missing).toEqual([]);
  });
});
