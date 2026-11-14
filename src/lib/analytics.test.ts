import { describe, expect, it } from "vitest";
import { addGeo, geoFromHeaders } from "./analytics";

const vercel = new Headers({
  "x-vercel-ip-country": "ES",
  "x-vercel-ip-city": "M%C3%A1laga",
  "x-vercel-ip-country-region": "AN",
  "x-vercel-ip-continent": "EU",
});

describe("geoFromHeaders", () => {
  it("maps Vercel's location headers to PostHog's GeoIP properties", () => {
    expect(geoFromHeaders(vercel)).toEqual({
      $geoip_country_code: "ES",
      $geoip_country_name: "Spain",
      $geoip_city_name: "Málaga",
      $geoip_subdivision_1_code: "AN",
      $geoip_continent_code: "EU",
    });
  });

  it("names Mauritania", () => {
    expect(geoFromHeaders(new Headers({ "x-vercel-ip-country": "MR" }))).toEqual({
      $geoip_country_code: "MR",
      $geoip_country_name: "Mauritania",
    });
  });

  it("is empty off Vercel and ignores malformed countries", () => {
    expect(geoFromHeaders(new Headers())).toEqual({});
    expect(geoFromHeaders(new Headers({ "x-vercel-ip-country": "<script>" }))).toEqual({});
  });
});

describe("addGeo", () => {
  const geo = { $geoip_country_code: "MR", $geoip_country_name: "Mauritania" };

  it("adds the location to a single event and keeps its properties", () => {
    expect(addGeo({ event: "$pageview", properties: { token: "phc_x" } }, geo)).toEqual({
      event: "$pageview",
      properties: { token: "phc_x", ...geo },
    });
  });

  it("handles arrays and { batch } bodies", () => {
    expect(addGeo([{ event: "a" }], geo)).toEqual([{ event: "a", properties: geo }]);
    expect(addGeo({ batch: [{ event: "a", properties: {} }] }, geo)).toEqual({
      batch: [{ event: "a", properties: geo }],
    });
  });

  it("never overrides a location the event already has", () => {
    const event = { event: "a", properties: { $geoip_country_code: "FR" } };
    expect(addGeo(event, geo)).toBe(event);
  });

  it("returns the body untouched without a location or for non-objects", () => {
    const body = { event: "a" };
    expect(addGeo(body, {})).toBe(body);
    expect(addGeo("text", geo)).toBe("text");
  });
});
