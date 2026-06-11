import { NextResponse } from "next/server";
import {
  authenticateWithSupabasePassword,
  getProfileByUserId,
  setAuthCookie,
} from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email =
    body && typeof body === "object" && "email" in body
      ? String((body as Record<string, unknown>).email).trim().toLowerCase()
      : "";
  const password =
    body && typeof body === "object" && "password" in body
      ? String((body as Record<string, unknown>).password)
      : "";

  const { user, error } = await authenticateWithSupabasePassword({
    email,
    password,
  });

  if (error || !user) {
    return NextResponse.json(
      { error: error ?? "Invalid admin login." },
      { status: 401 },
    );
  }

  const profile = await getProfileByUserId(user.id);

  if (!profile || profile.role !== "admin") {
    const response = NextResponse.json(
      { error: "You do not have admin access." },
      { status: 403 },
    );
    return response;
  }

  const response = NextResponse.json({ success: true });
  return setAuthCookie(response, "admin", {
    userId: user.id,
    email: profile.email,
  });
}
