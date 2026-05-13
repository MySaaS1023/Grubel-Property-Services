import { NextResponse } from "next/server";

const mockQuotes = [
  {
    quoteNumber: "GPS-1001",
    customerName: "Test Customer",
    serviceType: "Virtual Inspection",
    propertyAddress: "123 Main St, Phoenix, AZ",
    amount: 7500,
    displayAmount: "$75.00",
    paymentStatus: "unpaid",
    serviceStatus: "Awaiting Payment",
    scheduledDate: "Pending payment",
    assignedTeam: "Scheduling pending",
    nextStep: "Complete your deposit to confirm scheduling.",
    notes: "Please complete your deposit to confirm scheduling.",
  },
  {
    quoteNumber: "GPS-1002",
    customerName: "Test Deposit Customer",
    serviceType: "Repair",
    propertyAddress: "456 Oak Ave, Mesa, AZ",
    amount: 10000,
    displayAmount: "$100.00",
    paymentStatus: "deposit_paid",
    serviceStatus: "Scheduled",
    scheduledDate: "May 22, 2026",
    assignedTeam: "Repair Coordination Team",
    nextStep: "Grubel Property Services will confirm arrival details before the scheduled visit.",
    notes: "Deposit received. Your repair service has been scheduled.",
  },
  {
    quoteNumber: "GPS-1003",
    customerName: "Test Paid Customer",
    serviceType: "Turnover Prep",
    propertyAddress: "789 Desert View Rd, Scottsdale, AZ",
    amount: 15000,
    displayAmount: "$150.00",
    paymentStatus: "paid",
    serviceStatus: "In Progress",
    scheduledDate: "May 24, 2026",
    assignedTeam: "Turnover Prep Team",
    nextStep: "Turnover prep is underway. Completion notes will be shared after final walkthrough.",
    notes: "Payment received. Work is currently in progress.",
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
