import { NextResponse } from "next/server";
import { subcontractors } from "@/lib/mock-data";

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

  const subcontractor = subcontractors.find(
    (item) => item.email.toLowerCase() === email,
  );

  // MVP demo access code. Future auth should use Supabase Auth with
  // subcontractor role permissions and invite-based onboarding.
  if (!subcontractor || accessCode !== "sub123") {
    return NextResponse.json(
      { error: "We could not validate that subcontractor access." },
      { status: 401 },
    );
  }

  return NextResponse.json({
    success: true,
    email: subcontractor.email,
    subcontractorId: subcontractor.id,
  });
}
