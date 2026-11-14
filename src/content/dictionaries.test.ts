import { describe, expect, it } from "vitest";
import { getDictionary, locales } from ".";
import { en } from "./en";
import { fr } from "./fr";

type Leaf = { path: string; value: unknown };

function leaves(value: unknown, path = ""): Leaf[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => leaves(item, `${path}[${index}]`));
  }
  if (typeof value === "object" && value !== null) {
    return Object.entries(value).flatMap(([key, child]) =>
      leaves(child, path ? `${path}.${key}` : key),
    );
  }
  return [{ path, value }];
}

describe("dictionaries", () => {
  it("FR and EN have exactly the same keys", () => {
    expect(leaves(en).map((leaf) => leaf.path)).toEqual(leaves(fr).map((leaf) => leaf.path));
  });

  it.each([
    ["fr", fr],
    ["en", en],
  ] as const)("%s has no empty value", (_locale, dict) => {
    for (const leaf of leaves(dict)) {
      expect(
        typeof leaf.value === "string" ? leaf.value.trim() : leaf.value,
        leaf.path,
      ).toBeTruthy();
    }
  });

  it("getDictionary returns the dictionary of each locale", () => {
    expect(locales.map((locale) => getDictionary(locale))).toEqual([fr, en]);
  });
});
