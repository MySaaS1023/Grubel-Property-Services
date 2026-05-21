import { NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth";
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

  const allowedEmail = process.env.SUBCONTRACTOR_TEST_EMAIL?.toLowerCase();
  const allowedCode = process.env.SUBCONTRACTOR_TEST_CODE;

  if (!allowedEmail || !allowedCode) {
    return NextResponse.json(
      { error: "Subcontractor access is not configured." },
      { status: 503 },
    );
  }

  if (email !== allowedEmail || accessCode !== allowedCode) {
    return NextResponse.json(
      { error: "We could not validate that subcontractor access." },
      { status: 401 },
    );
  }

  const subcontractor = subcontractors.find(
    (item) => item.email.toLowerCase() === email,
  );
  const response = NextResponse.json({
    success: true,
    email,
    subcontractorId: subcontractor?.id,
  });

  return setAuthCookie(response, "subcontractor", {
    email,
    subcontractorId: subcontractor?.id,
  });
}
