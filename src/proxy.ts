import { NextResponse, type NextRequest } from "next/server";
import { localeFromAcceptLanguage } from "@/lib/site";

export function proxy(request: NextRequest) {
  const locale = localeFromAcceptLanguage(request.headers.get("accept-language"));
  return NextResponse.redirect(new URL(`/${locale}`, request.url));
}

export const config = {
  matcher: "/",
};
