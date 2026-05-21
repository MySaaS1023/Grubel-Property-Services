import { NextRequest, NextResponse } from "next/server";
import { getSessionCookieName, verifySessionToken } from "@/lib/auth";
import type { SessionRole } from "@/lib/auth";

const protectedRoutes: Array<{
  prefix: string;
  role: SessionRole;
  loginPath: string;
}> = [
  { prefix: "/admin", role: "admin", loginPath: "/admin-login" },
  {
    prefix: "/subcontractor-portal",
    role: "subcontractor",
    loginPath: "/subcontractor-login",
  },
  { prefix: "/customer-portal", role: "customer", loginPath: "/customer-login" },
];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const route = protectedRoutes.find(
    (item) => pathname === item.prefix || pathname.startsWith(`${item.prefix}/`),
  );

  if (!route) {
    return NextResponse.next();
  }

  const token = request.cookies.get(getSessionCookieName(route.role))?.value;
  const session = await verifySessionToken(token, route.role);

  if (!session) {
    const redirectUrl = new URL(route.loginPath, request.url);
    redirectUrl.searchParams.set(
      "next",
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );
    return NextResponse.redirect(redirectUrl);
  }

  if (
    route.role === "customer" &&
    session.quoteNumber &&
    request.nextUrl.searchParams.get("quote") !== session.quoteNumber
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.searchParams.set("quote", session.quoteNumber);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/subcontractor-portal/:path*",
    "/customer-portal/:path*",
  ],
};
