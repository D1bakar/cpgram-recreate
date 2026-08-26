import { NextResponse } from "next/server";

import {
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
  verifySession,
} from "@/lib/session";

export async function POST(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token, { allowExpired: true });

  if (!session) {
    return NextResponse.json({ error: "No active session" }, { status: 401 });
  }

  const newToken = await createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, newToken, sessionCookieOptions());
  return response;
}
