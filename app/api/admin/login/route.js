import { NextResponse } from "next/server";

import {
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
  verifyCredentials,
} from "@/lib/session";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const accessCode = body?.accessCode ?? "";
  const password = body?.password ?? "";

  if (!verifyCredentials(accessCode, password)) {
    return NextResponse.json(
      { error: "Invalid access code or password" },
      { status: 401 },
    );
  }

  const token = await createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return response;
}
