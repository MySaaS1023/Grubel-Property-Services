import { NextResponse } from "next/server";

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

  const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@grubelps.com").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";

  // Future auth replacement: Supabase Auth or NextAuth with Admin role checks,
  // secure cookies, MFA, audit logging, and protected server routes.
  if (email !== adminEmail || password !== adminPassword) {
    return NextResponse.json({ error: "Invalid admin login." }, { status: 401 });
  }

  return NextResponse.json({ success: true });
}
