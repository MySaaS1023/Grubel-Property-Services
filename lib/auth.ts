import type { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createAuthSupabaseClient,
  createServiceSupabaseClient,
} from "@/lib/supabase/server";

export type SessionRole = "admin" | "subcontractor" | "customer";

export type AuthSession = {
  role: SessionRole;
  userId?: string;
  email?: string;
  quoteNumber?: string;
  subcontractorId?: string;
  exp: number;
};

export type ProfileRole = "admin" | "customer" | "subcontractor";

export type UserProfile = {
  id: string;
  email: string;
  role: ProfileRole;
  fullName?: string | null;
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

export async function authenticateWithSupabasePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const supabase = createAuthSupabaseClient();

  if (!supabase) {
    return { user: null, error: "Supabase Auth is not configured." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { user: null, error: error?.message ?? "Invalid login." };
  }

  return { user: data.user, error: null };
}

export async function getProfileByUserId(userId: string) {
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from("profiles")
    .select("id,email,role,full_name")
    .eq("id", userId)
    .maybeSingle();

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    email: data.email,
    role: data.role,
    fullName: data.full_name,
  } as UserProfile;
}

export async function getCurrentUser(role?: SessionRole) {
  const cookieStore = await cookies();
  const roles = role ? [role] : (["admin", "subcontractor", "customer"] as const);

  for (const item of roles) {
    const session = await verifySessionToken(
      cookieStore.get(getSessionCookieName(item))?.value,
      item,
    );

    if (session) {
      return session;
    }
  }

  return null;
}

export async function getCurrentProfile(role?: SessionRole) {
  const session = await getCurrentUser(role);

  if (!session?.userId) {
    return null;
  }

  return getProfileByUserId(session.userId);
}

export async function requireAuthenticatedUser(loginPath = "/customer-login") {
  const session = await getCurrentUser();

  if (!session) {
    redirect(loginPath);
  }

  return session;
}

export async function requireAdmin() {
  const profile = await getCurrentProfile("admin");

  if (!profile || profile.role !== "admin") {
    redirect("/admin-login");
  }

  return profile;
}

export async function requireSubcontractor() {
  const profile = await getCurrentProfile("subcontractor");

  if (!profile || profile.role !== "subcontractor") {
    redirect("/subcontractor-login");
  }

  return profile;
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
