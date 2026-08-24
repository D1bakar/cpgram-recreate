const SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 15 * 60 * 1000;

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set");
  }
  return secret;
}

function bytesToB64url(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function b64urlToBytes(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getKey() {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function createSessionToken() {
  const now = Date.now();
  const payload = { iat: now, exp: now + SESSION_TTL_MS };
  const encoder = new TextEncoder();
  const payloadBytes = encoder.encode(JSON.stringify(payload));
  const key = await getKey();
  const signature = await crypto.subtle.sign("HMAC", key, payloadBytes);
  return `${bytesToB64url(payloadBytes)}.${bytesToB64url(
    new Uint8Array(signature),
  )}`;
}

export async function verifySession(token, { allowExpired = false } = {}) {
  if (!token) {
    return null;
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return null;
  }

  const [payloadPart, signaturePart] = parts;
  let payloadBytes;
  let signatureBytes;
  try {
    payloadBytes = b64urlToBytes(payloadPart);
    signatureBytes = b64urlToBytes(signaturePart);
  } catch {
    return null;
  }

  const key = await getKey();
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    signatureBytes,
    payloadBytes,
  );
  if (!valid) {
    return null;
  }

  try {
    const payload = JSON.parse(new TextDecoder().decode(payloadBytes));
    if (typeof payload.exp !== "number") {
      return null;
    }
    if (!allowExpired && payload.exp < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function verifyCredentials(accessCode, password) {
  const expectedCode = process.env.ADMIN_ACCESS_CODE;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedCode || !expectedPassword) {
    return false;
  }
  return accessCode === expectedCode && password === expectedPassword;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  };
}

export { SESSION_COOKIE, SESSION_TTL_MS };
