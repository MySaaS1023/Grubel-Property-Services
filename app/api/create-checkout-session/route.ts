import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";

export async function POST(request: Request) {
  const stripe = getStripeClient();

  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured." },
      { status: 500 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const quoteNumber =
    body && typeof body === "object" && "quoteNumber" in body
      ? String(payload.quoteNumber).trim().toUpperCase()
      : "";
  const serviceType =
    body && typeof body === "object" && "serviceType" in body
      ? String(payload.serviceType).trim()
      : "";
  const amount =
    body && typeof body === "object" && "amount" in body
      ? Number(payload.amount)
      : 0;

  if (!quoteNumber || !serviceType || !Number.isInteger(amount) || amount <= 0) {
    return NextResponse.json(
      { error: "Valid quote number, service type, and amount are required." },
      { status: 400 },
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          product_data: {
            name: `${serviceType} Deposit`,
            description: `Quote ${quoteNumber}`,
          },
          unit_amount: amount,
        },
      },
    ],
    metadata: {
      quoteNumber,
      serviceType,
    },
    success_url: `${siteUrl}/success?quote=${encodeURIComponent(quoteNumber)}`,
    cancel_url: `${siteUrl}/payment`,
  });

  return NextResponse.json({ url: session.url });
}
