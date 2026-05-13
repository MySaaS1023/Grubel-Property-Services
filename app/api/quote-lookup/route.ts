import { NextResponse } from "next/server";
import { getPortalRecord } from "@/lib/operations-data";

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

  // Future Supabase integration point: replace this mock lookup with a query
  // joining quotes, projects, payments, uploads, and messages by quote number.
  const portalRecord = getPortalRecord(quoteNumber);

  if (!portalRecord) {
    return NextResponse.json({ error: "Quote not found." }, { status: 404 });
  }

  const { quote, project, payment, uploads, messages } = portalRecord;

  return NextResponse.json({
    quote: {
      quoteNumber: quote.quoteNumber,
      customerName: quote.customerName,
      serviceType: quote.serviceType,
      propertyAddress: quote.propertyAddress,
      amount: quote.amount,
      displayAmount: quote.displayAmount,
      paymentStatus: quote.paymentStatus,
      serviceStatus: project?.status ?? quote.quoteStatus,
      scheduledDate: project?.scheduledDate ?? "Pending",
      assignedTeam: project?.assignedTeam ?? "Pending assignment",
      nextStep: project?.nextStep ?? quote.notes,
      notes: project?.notes ?? quote.notes,
      quoteStatus: quote.quoteStatus,
      expiresAt: quote.expiresAt,
      paidAt: payment?.paidAt,
      paymentMethod: payment?.method ?? "Pending",
      uploads,
      messages,
      invoiceHistory: payment ? [payment] : [],
    },
  });
}
