import { NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth";
import { quotes } from "@/lib/mock-data";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const quoteNumber =
    body && typeof body === "object" && "quoteNumber" in body
      ? String((body as Record<string, unknown>).quoteNumber).trim().toUpperCase()
      : "";
  const email =
    body && typeof body === "object" && "email" in body
      ? String((body as Record<string, unknown>).email).trim().toLowerCase()
      : "";

  const supabase = createServiceSupabaseClient();

  if (supabase) {
    const { data: quote, error } = await supabase
      .from("quotes")
      .select("quote_number")
      .eq("quote_number", quoteNumber)
      .eq("customer_email", email)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: `Unable to validate quote access: ${error.message}` },
        { status: 500 },
      );
    }

    if (!quote) {
      return NextResponse.json(
        {
          error:
            "We could not find a matching quote. Please check your information or contact Grubel Property Services.",
        },
        { status: 404 },
      );
    }

    const response = NextResponse.json({
      success: true,
      quoteNumber: quote.quote_number,
    });
    return setAuthCookie(response, "customer", {
      email,
      quoteNumber: quote.quote_number,
    });
  }

  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        error:
          "Customer portal access is not configured. Please contact Grubel Property Services.",
      },
      { status: 503 },
    );
  }

  const quote = quotes.find(
    (item) =>
      item.quoteNumber === quoteNumber &&
      item.customerEmail.toLowerCase() === email,
  );

  if (!quote) {
    return NextResponse.json(
      {
        error:
          "We could not find a matching quote. Please check your information or contact Grubel Property Services.",
      },
      { status: 404 },
    );
  }

  const response = NextResponse.json({
    success: true,
    quoteNumber: quote.quoteNumber,
  });
  return setAuthCookie(response, "customer", {
    email,
    quoteNumber: quote.quoteNumber,
  });
}
