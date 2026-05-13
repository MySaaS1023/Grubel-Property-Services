import { NextResponse } from "next/server";

const mockQuotes = [
  {
    quoteNumber: "GPS-1001",
    customerName: "Test Customer",
    serviceType: "Inspection",
    propertyAddress: "123 Main St, Phoenix, AZ",
    amount: 7500,
    displayAmount: "$75.00",
    paymentStatus: "unpaid",
    serviceStatus: "Awaiting Payment",
    notes: "Please complete your deposit to confirm scheduling.",
  },
  {
    quoteNumber: "GPS-1002",
    customerName: "Test Paid Customer",
    serviceType: "Repair",
    propertyAddress: "456 Oak Ave, Mesa, AZ",
    amount: 10000,
    displayAmount: "$100.00",
    paymentStatus: "paid",
    serviceStatus: "Scheduled",
    notes: "Your service has been scheduled.",
  },
] as const;

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const quoteNumber =
    body && typeof body === "object" && "quoteNumber" in body
      ? String((body as Record<string, unknown>).quoteNumber).trim().toUpperCase()
      : "";

  if (!quoteNumber) {
    return NextResponse.json({ error: "Quote number is required." }, { status: 400 });
  }

  // Future database connection point: replace this mock lookup with Supabase
  // or another database query by quote number.
  const quote = mockQuotes.find((item) => item.quoteNumber === quoteNumber);

  if (!quote) {
    return NextResponse.json({ error: "Quote not found." }, { status: 404 });
  }

  return NextResponse.json({ quote });
}
