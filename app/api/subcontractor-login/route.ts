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
  const accessCode =
    body && typeof body === "object" && "accessCode" in body
      ? String((body as Record<string, unknown>).accessCode).trim()
      : "";

  const { user, error } = await authenticateWithSupabasePassword({
    email,
    password: accessCode,
  });

  if (error || !user) {
    return NextResponse.json(
      { error: error ?? "We could not validate that subcontractor access." },
      { status: 401 },
    );
  }

  const profile = await getProfileByUserId(user.id);

  if (!profile || profile.role !== "subcontractor") {
    return NextResponse.json(
      { error: "You do not have subcontractor access." },
      { status: 403 },
    );
  }

  const response = NextResponse.json({
    success: true,
    email: profile.email,
    subcontractorId: user.id,
  });

  return setAuthCookie(response, "subcontractor", {
    userId: user.id,
    email: profile.email,
    subcontractorId: user.id,
  });
}
