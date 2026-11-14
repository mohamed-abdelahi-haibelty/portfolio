import { NextResponse, type NextRequest } from "next/server";
import { addGeo, geoFromHeaders, MAX_EVENT_BYTES, POSTHOG_INGEST_ORIGIN } from "@/lib/analytics";
import { localeFromAcceptLanguage } from "@/lib/site";

/** `/ingest/*`: relay visit statistics to PostHog EU, with the visitor's location added. */
async function relayToPostHog(request: NextRequest): Promise<Response> {
  const path = request.nextUrl.pathname.slice("/ingest".length) || "/";
  const target = new URL(path + request.nextUrl.search, POSTHOG_INGEST_ORIGIN);
  const headers = new Headers({
    "content-type": request.headers.get("content-type") ?? "application/json",
  });
  // Cookieless mode hashes IP + user agent server-side; forward both, as a rewrite would.
  for (const name of ["user-agent", "x-forwarded-for"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  let body: string | undefined;
  if (request.method === "POST") {
    body = await request.text();
    if (body.length > MAX_EVENT_BYTES) return new Response(null, { status: 413 });
    try {
      body = JSON.stringify(addGeo(JSON.parse(body), geoFromHeaders(request.headers)));
    } catch {
      // Not JSON (e.g. compressed batches): forward as received.
    }
  } else if (request.method !== "GET") {
    return new Response(null, { status: 405 });
  }

  const upstream = await fetch(target, { method: request.method, headers, body: body ?? null });
  return new Response(upstream.body, {
    status: upstream.status,
    headers: { "content-type": upstream.headers.get("content-type") ?? "application/json" },
  });
}

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/ingest/")) return relayToPostHog(request);
  const locale = localeFromAcceptLanguage(request.headers.get("accept-language"));
  return NextResponse.redirect(new URL(`/${locale}`, request.url));
}

export const config = {
  matcher: ["/", "/ingest/:path*"],
};
