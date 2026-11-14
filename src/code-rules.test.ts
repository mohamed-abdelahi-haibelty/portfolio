import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(__dirname, "..");

function sourceFiles(dir: string): string[] {
  return readdirSync(join(root, dir), { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile() && /\.(tsx?|css)$/.test(entry.name))
    .map((entry) => relative(root, join(entry.parentPath, entry.name)));
}

describe("code rules", () => {
  it("components and sections use colour tokens, never hex literals", () => {
    const offenders = [...sourceFiles("src/components"), ...sourceFiles("src/sections")].flatMap(
      (file) =>
        (readFileSync(join(root, file), "utf8").match(/#[0-9a-f]{3,8}\b/gi) ?? []).map(
          (hex) => `${file}: ${hex}`,
        ),
    );
    expect(offenders).toEqual([]);
  });

  it("at most one Client Component (the mobile menu)", () => {
    const clientFiles = sourceFiles("src").filter((file) =>
      /^\s*["']use client["']/m.test(readFileSync(join(root, file), "utf8")),
    );
    expect(clientFiles.length).toBeLessThanOrEqual(1);
  });
});
