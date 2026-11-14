import { describe, expect, it } from "vitest";
import { externalLinkProps } from "./links";

describe("externalLinkProps", () => {
  it("opens wa.me in a new tab with noopener noreferrer", () => {
    expect(externalLinkProps("https://wa.me/22227117087?text=x")).toEqual({
      target: "_blank",
      rel: "noopener noreferrer",
    });
  });

  it.each(["tel:+22227117087", "mailto:a@b.c", "#contact", "/en#contact"])(
    "keeps %s in the same tab",
    (href) => {
      expect(externalLinkProps(href)).toEqual({});
    },
  );
});
