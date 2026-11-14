/**
 * Visit statistics relay (`proxy.ts` → `/ingest/*`). PostHog's cookieless mode
 * discards the visitor IP before its own GeoIP lookup, so the location Vercel
 * already detects at the edge is added to each event as PostHog's `$geoip_*`
 * properties. No IP is added to the event itself.
 */
export const POSTHOG_INGEST_ORIGIN = "https://eu.i.posthog.com";

/** Events from `public/stats.js` are a few KB; anything larger is refused. */
export const MAX_EVENT_BYTES = 64 * 1024;

export type Geo = Partial<
  Record<
    | "$geoip_country_code"
    | "$geoip_country_name"
    | "$geoip_city_name"
    | "$geoip_subdivision_1_code"
    | "$geoip_continent_code",
    string
  >
>;

type HeaderReader = { get(name: string): string | null };

const countryNames = new Intl.DisplayNames(["en"], { type: "region" });

function decoded(value: string | null): string | undefined {
  if (!value) return undefined;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/** Location from Vercel's edge headers (`x-vercel-ip-*`); empty off Vercel. */
export function geoFromHeaders(headers: HeaderReader): Geo {
  const geo: Geo = {};
  const country = headers.get("x-vercel-ip-country")?.toUpperCase();
  if (country && /^[A-Z]{2}$/.test(country)) {
    geo.$geoip_country_code = country;
    geo.$geoip_country_name = countryNames.of(country) ?? country;
  }
  const city = decoded(headers.get("x-vercel-ip-city"));
  if (city) geo.$geoip_city_name = city;
  const region = headers.get("x-vercel-ip-country-region");
  if (region) geo.$geoip_subdivision_1_code = region;
  const continent = headers.get("x-vercel-ip-continent");
  if (continent) geo.$geoip_continent_code = continent;
  return geo;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function withGeo(event: unknown, geo: Geo): unknown {
  if (!isRecord(event)) return event;
  const properties = isRecord(event.properties) ? event.properties : {};
  // An event that already carries a location keeps it as a whole.
  if ("$geoip_country_code" in properties) return event;
  return { ...event, properties: { ...properties, ...geo } };
}

/**
 * Adds the location to a capture body: one event, an array of events, or
 * `{ batch: [...] }`. Returns the body untouched when there is no location.
 */
export function addGeo(body: unknown, geo: Geo): unknown {
  if (Object.keys(geo).length === 0) return body;
  if (Array.isArray(body)) return body.map((event) => withGeo(event, geo));
  if (isRecord(body) && Array.isArray(body.batch)) {
    return { ...body, batch: body.batch.map((event) => withGeo(event, geo)) };
  }
  return withGeo(body, geo);
}
