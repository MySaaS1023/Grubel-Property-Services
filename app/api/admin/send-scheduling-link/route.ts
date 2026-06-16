import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { sendSchedulingLinkEmail } from "@/lib/workflow-email-automation";

export async function POST(request: Request) {
  const profile = await getCurrentProfile("admin");

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const requestId = typeof body?.requestId === "string" ? body.requestId.trim() : "";

  if (!requestId) {
    return NextResponse.json({ error: "Request id is required." }, { status: 400 });
  }

  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const { data: serviceRequest, error } = await supabase
    .from("service_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (error || !serviceRequest) {
    console.error("[admin-scheduling-link] request lookup failed", error);
    return NextResponse.json(
      { error: "We could not find this service request." },
      { status: 404 },
    );
  }

  const customerEmail =
    typeof serviceRequest.customer_email === "string"
      ? serviceRequest.customer_email
      : "";
  const scheduleLink = `https://grubelps.com/schedule-consultation?requestId=${encodeURIComponent(requestId)}`;

  const result = await sendSchedulingLinkEmail({
    serviceRequestId: requestId,
    customerName:
      typeof serviceRequest.customer_name === "string"
        ? serviceRequest.customer_name
        : undefined,
    customerEmail,
    propertyAddress:
      typeof serviceRequest.property_address === "string"
        ? serviceRequest.property_address
        : undefined,
    scheduleLink,
  });

  if (!result.sent) {
    const reason =
      "errorMessage" in result && result.errorMessage
        ? result.errorMessage
        : "skippedReason" in result && result.skippedReason
          ? result.skippedReason
          : "Email provider did not accept the message.";

    return NextResponse.json(
      {
        success: false,
        error: reason,
        providerStatus: "providerStatus" in result ? result.providerStatus : undefined,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    success: true,
    message: "Scheduling link sent to customer.",
    providerResponseId: "id" in result ? result.id : undefined,
    providerStatus: "providerStatus" in result ? result.providerStatus : undefined,
    recipientEmail: "recipientEmail" in result ? result.recipientEmail : customerEmail,
  });
}
