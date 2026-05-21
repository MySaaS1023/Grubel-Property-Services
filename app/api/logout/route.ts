import { NextResponse } from "next/server";
import { getSessionCookieName } from "@/lib/auth";
import type { SessionRole } from "@/lib/auth";

const loginPaths: Record<SessionRole, string> = {
  admin: "/admin-login",
  subcontractor: "/subcontractor-login",
  customer: "/customer-login",
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const role =
    body && typeof body === "object" && "role" in body
      ? String((body as Record<string, unknown>).role)
      : "";
  const resolvedRole: SessionRole =
    role === "admin" || role === "subcontractor" || role === "customer"
      ? role
      : "customer";

  const response = NextResponse.json({
    success: true,
    redirectTo: loginPaths[resolvedRole],
  });

  response.cookies.delete(getSessionCookieName(resolvedRole));
  return response;
}
