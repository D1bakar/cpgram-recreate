import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";

import { routing } from "./i18n/routing";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

const handleI18n = createMiddleware(routing);

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  if (pathname === "/file-complaint" || pathname === "/track") {
    return NextResponse.redirect(new URL(`/en${pathname}`, request.url));
  }

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = await verifySession(token);

    if (pathname === "/admin/login") {
      if (session) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  return handleI18n(request);
}

export const config = {
  matcher: [
    "/",
    "/(en|hi)/:path*",
    "/file-complaint",
    "/track",
    "/admin/:path*",
    "/api/:path*",
  ],
};
