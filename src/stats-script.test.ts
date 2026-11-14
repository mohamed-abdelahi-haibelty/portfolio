import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// public/stats.js is a plain browser script; run it in jsdom as the page would.
const source = readFileSync(join(__dirname, "..", "public", "stats.js"), "utf8");

type Sent = { event: string; properties: Record<string, unknown> };

let fetchMock: ReturnType<typeof vi.fn>;
let beaconBodies: Blob[];
let added: [EventTarget, string, EventListenerOrEventListenerObject][] = [];

/** Record the listeners each run adds, so one test's script does not leak into the next. */
function trackListeners(target: EventTarget) {
  const original = target.addEventListener.bind(target);
  vi.spyOn(target, "addEventListener").mockImplementation((type, listener, options) => {
    if (listener) added.push([target, type, listener]);
    original(type, listener, options);
  });
}

function run(key: string | null, webdriver = false) {
  const script = document.createElement("script");
  if (key) script.setAttribute("data-key", key);
  Object.defineProperty(document, "currentScript", { value: script, configurable: true });
  Object.defineProperty(navigator, "webdriver", { value: webdriver, configurable: true });
  // eslint-disable-next-line @typescript-eslint/no-implied-eval -- runs the shipped script text
  (new Function(source) as () => void)();
}

function fetched(): Sent[] {
  return fetchMock.mock.calls.map(
    ([, init]) => JSON.parse((init as { body: string }).body) as Sent,
  );
}

async function beaconed(): Promise<Sent[]> {
  return Promise.all(beaconBodies.map(async (blob) => JSON.parse(await blob.text()) as Sent));
}

beforeEach(() => {
  trackListeners(document);
  trackListeners(window);
  fetchMock = vi.fn(() => Promise.resolve(new Response(null)));
  vi.stubGlobal("fetch", fetchMock);
  beaconBodies = [];
  Object.defineProperty(navigator, "sendBeacon", {
    configurable: true,
    value: (url: string, body: Blob) => {
      expect(url).toBe("/ingest/i/v0/e");
      beaconBodies.push(body);
      return true;
    },
  });
  document.documentElement.lang = "fr";
  document.body.innerHTML = `
    <section id="contact">
      <a href="https://wa.me/22227117087?text=Bonjour">WhatsApp</a>
      <a href="tel:+22227117087">Téléphone</a>
      <a href="mailto:mohamed.abdellahi.haibelti@gmail.com">E-mail</a>
      <a href="#method">Méthode</a>
    </section>
    <header><a href="/en" hreflang="en" data-keep-hash>EN</a></header>`;
});

afterEach(() => {
  for (const [target, type, listener] of added) target.removeEventListener(type, listener);
  added = [];
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

describe("public/stats.js", () => {
  it("sends a cookieless $pageview to the first-party endpoint", () => {
    run("phc_test");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe("/ingest/i/v0/e");
    const [pageview] = fetched();
    expect(pageview?.event).toBe("$pageview");
    expect(pageview?.properties).toMatchObject({
      token: "phc_test",
      distinct_id: "$posthog_cookieless",
      $cookieless_mode: true,
      $process_person_profile: false,
      $referrer: "$direct",
      $referring_domain: "$direct",
      locale: "fr",
    });
    expect(document.cookie).toBe("");
  });

  it("does nothing without a key or under automation", () => {
    run(null);
    run("phc_test", true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("records contact clicks by channel and language switches", async () => {
    run("phc_test");
    for (const link of document.querySelectorAll("a")) {
      link.addEventListener("click", (event) => {
        event.preventDefault();
      });
      link.click();
    }
    const events = (await beaconed()).map((e) => [
      e.event,
      e.properties.channel ?? e.properties.to,
    ]);
    expect(events).toEqual([
      ["contact_click", "whatsapp"],
      ["contact_click", "phone"],
      ["contact_click", "email"],
      ["language_switch", "en"],
    ]);
    expect((await beaconed())[0]?.properties.section).toBe("contact");
  });

  it("sends one $pageleave with the time spent when the page is hidden", async () => {
    run("phc_test");
    Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
    window.dispatchEvent(new Event("pagehide"));
    const leaves = (await beaconed()).filter((e) => e.event === "$pageleave");
    expect(leaves).toHaveLength(1);
    expect(typeof leaves[0]?.properties.$prev_pageview_duration).toBe("number");
  });
});
