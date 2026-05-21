import { NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth";

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

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return NextResponse.json(
      { error: "Admin credentials are not configured." },
      { status: 503 },
    );
  }

  if (email !== adminEmail || password !== adminPassword) {
    return NextResponse.json({ error: "Invalid admin login." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  return setAuthCookie(response, "admin", { email });
}
