import type { NextResponse } from "next/server";

export type SessionRole = "admin" | "subcontractor" | "customer";

export type AuthSession = {
  role: SessionRole;
  email?: string;
  quoteNumber?: string;
  subcontractorId?: string;
  exp: number;
};

const cookieNames: Record<SessionRole, string> = {
  admin: "gps_admin_session",
  subcontractor: "gps_subcontractor_session",
  customer: "gps_customer_session",
};

export function getSessionCookieName(role: SessionRole) {
  return cookieNames[role];
}

export async function createSessionToken(
  role: SessionRole,
  data: Omit<AuthSession, "role" | "exp">,
  maxAgeSeconds = 60 * 60 * 8,
) {
  const session: AuthSession = {
    role,
    ...data,
    exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
  };
  const payload = base64UrlEncode(JSON.stringify(session));
  const signature = await sign(payload);

  return `${payload}.${signature}`;
}

export async function verifySessionToken(
  token: string | undefined,
  role: SessionRole,
) {
  if (!token) {
    return null;
  }

  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = await sign(payload);
  if (!timingSafeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const session = JSON.parse(base64UrlDecode(payload)) as AuthSession;
    if (session.role !== role || session.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function setAuthCookie(
  response: NextResponse,
  role: SessionRole,
  data: Omit<AuthSession, "role" | "exp">,
) {
  const maxAge = 60 * 60 * 8;
  const token = await createSessionToken(role, data, maxAge);

  response.cookies.set(getSessionCookieName(role), token, {
    httpOnly: true,
    maxAge,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}

async function sign(payload: string) {
  const secret = getSessionSecret();
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );

  return bytesToBase64Url(new Uint8Array(signature));
}

function getSessionSecret() {
  return (
    process.env.AUTH_SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.ADMIN_PASSWORD ||
    process.env.SUBCONTRACTOR_TEST_CODE ||
    "development-only-session-secret"
  );
}

function base64UrlEncode(value: string) {
  return bytesToBase64Url(new TextEncoder().encode(value));
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function timingSafeEqual(left: string, right: string) {
  if (left.length !== right.length) {
    return false;
  }

  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return result === 0;
}
