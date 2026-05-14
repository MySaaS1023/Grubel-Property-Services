import { NextResponse } from "next/server";
import { quotes } from "@/lib/mock-data";

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

  return NextResponse.json({
    success: true,
    quoteNumber: quote.quoteNumber,
  });
}
