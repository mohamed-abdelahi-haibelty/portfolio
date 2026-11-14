import { createCn } from "cn/config";

/**
 * Class merger that knows the design's font-size tokens, so `text-h2` and
 * `text-ink` are not treated as two conflicting colours.
 */
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: ["h1", "h2", "card", "lead", "body", "hand", "sticky", "label", "hello", "value"],
        },
      ],
    },
  },
});
