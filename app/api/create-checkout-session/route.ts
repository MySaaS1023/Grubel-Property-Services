import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";

const deposits = {
  inspection: {
    name: "Inspection Deposit",
    amount: 7500,
  },
  repair: {
    name: "Repair Deposit",
    amount: 10000,
  },
  "turnover-prep": {
    name: "Turnover Prep Deposit",
    amount: 15000,
  },
} as const;

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

  const type =
    body && typeof body === "object" && "type" in body
      ? String((body as Record<string, unknown>).type)
      : "";
  const deposit = deposits[type as keyof typeof deposits];

  if (!deposit) {
    return NextResponse.json({ error: "Invalid payment type." }, { status: 400 });
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
            name: deposit.name,
          },
          unit_amount: deposit.amount,
        },
      },
    ],
    success_url: `${siteUrl}/success`,
    cancel_url: `${siteUrl}/cancel`,
  });

  return NextResponse.json({ url: session.url });
}
