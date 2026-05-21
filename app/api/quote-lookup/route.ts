import { NextResponse } from "next/server";
import { getPortalRecord } from "@/lib/operations-data";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

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

  const supabase = createServiceSupabaseClient();

  if (supabase) {
    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .select("*")
      .eq("quote_number", quoteNumber)
      .maybeSingle();

    if (quoteError) {
      return NextResponse.json(
        { error: `Unable to look up quote: ${quoteError.message}` },
        { status: 500 },
      );
    }

    if (!quote) {
      return NextResponse.json({ error: "Quote not found." }, { status: 404 });
    }

    const { data: project } = await supabase
      .from("projects")
      .select("*")
      .eq("quote_number", quoteNumber)
      .maybeSingle();

    const [{ data: payment }, { data: uploads }] = await Promise.all([
      supabase
        .from("payments")
        .select("*")
        .eq("quote_number", quoteNumber)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("uploads")
        .select("*")
        .in("related_id", [quote.id, project?.id].filter(Boolean)),
    ]);

    return NextResponse.json({
      quote: {
        quoteNumber: quote.quote_number,
        customerName: quote.customer_name,
        serviceType: quote.service_type,
        propertyAddress: quote.property_address,
        amount: quote.amount,
        depositAmount: quote.deposit_amount,
        amountPaid: quote.amount_paid,
        balanceDue: quote.balance_due,
        displayAmount: formatCents(quote.amount),
        displayDepositAmount: formatCents(quote.deposit_amount),
        displayAmountPaid: formatCents(quote.amount_paid),
        displayBalanceDue: formatCents(quote.balance_due),
        paymentStatus: quote.payment_status,
        serviceStatus: project?.status ?? quote.service_status,
        scheduledDate: project?.scheduled_date ?? "Pending",
        assignedTeam: project?.assigned_team ?? "Pending assignment",
        nextStep: project?.next_step ?? quote.notes,
        notes: project?.notes ?? quote.notes,
        quoteStatus: quote.quote_status,
        expiresAt: quote.expires_at,
        paidAt: payment?.paid_at,
        paymentMethod: payment?.method ?? "Pending",
        uploads: (uploads ?? []).map((upload) => ({
          id: upload.id,
          relatedId: upload.related_id,
          relatedType: upload.related_type,
          category: upload.category,
          fileName: upload.file_name,
          fileType: upload.file_type,
          size: upload.size,
          uploadedBy: upload.uploaded_by ?? "Grubel Property Services",
          createdAt: upload.created_at,
          storagePath: upload.storage_path,
        })),
        messages: [],
        invoiceHistory: payment
          ? [
              {
                id: payment.id,
                quoteNumber: payment.quote_number,
                customerId: payment.customer_id,
                amount: payment.amount,
                displayAmount: formatCents(payment.amount),
                status: payment.status,
                method: payment.method ?? "Stripe Checkout",
                paidAt: payment.paid_at,
                stripeSessionId: payment.stripe_session_id,
              },
            ]
          : [],
      },
    });
  }

  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        error:
          "Customer portal data is not configured. Please contact Grubel Property Services.",
      },
      { status: 503 },
    );
  }

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
      depositAmount: quote.depositAmount,
      amountPaid: quote.amountPaid,
      balanceDue: quote.balanceDue,
      displayAmount: quote.displayAmount,
      displayDepositAmount: quote.displayDepositAmount,
      displayAmountPaid: quote.displayAmountPaid,
      displayBalanceDue: quote.displayBalanceDue,
      paymentStatus: quote.paymentStatus,
      serviceStatus: project?.status ?? quote.serviceStatus,
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

function formatCents(value: number | null | undefined) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format((value ?? 0) / 100);
}
