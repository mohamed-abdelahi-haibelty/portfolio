// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { notFoundLocale, notFoundLocaleScript } from "./not-found";

describe("notFoundLocale", () => {
  it.each([
    ["/en/anything", "en"],
    ["/en", "en"],
    ["/en/", "en"],
    ["/fr/anything", "fr"],
    ["/xx", "fr"],
    ["/english", "fr"],
    ["/enx/page", "fr"],
    ["/", "fr"],
  ])("%s → %s", (path, expected) => {
    expect(notFoundLocale(path)).toBe(expected);
  });
});

describe("notFoundLocaleScript", () => {
  const run = (path: string) => {
    window.history.replaceState(null, "", path);
    document.documentElement.lang = "fr";
    document.title = "Oups";
    const script = document.createElement("script");
    script.textContent = notFoundLocaleScript("Oops, this page got lost.");
    document.head.append(script);
    script.remove();
  };

  afterEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("switches the document to English under /en", () => {
    run("/en/missing");
    expect(document.documentElement.lang).toBe("en");
    expect(document.title).toBe("Oops, this page got lost.");
  });

  it("leaves other paths in French", () => {
    run("/english/missing");
    expect(document.documentElement.lang).toBe("fr");
    expect(document.title).toBe("Oups");
  });

  it("cannot close its <script> tag through the title", () => {
    expect(notFoundLocaleScript("</script><b>")).not.toContain("</script>");
  });
});
