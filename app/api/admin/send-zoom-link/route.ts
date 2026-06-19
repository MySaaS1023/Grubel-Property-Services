import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { sendConsultationZoomLinkEmail } from "@/lib/workflow-email-automation";

export async function POST(request: Request) {
  const profile = await getCurrentProfile("admin");

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const requestId = read(body?.requestId);
  const zoomLink = read(body?.zoomLink);
  const optionalMessage = read(body?.optionalMessage);

  if (!requestId) {
    return NextResponse.json({ error: "Request id is required." }, { status: 400 });
  }

  if (!isValidZoomLink(zoomLink)) {
    return NextResponse.json(
      { error: "Enter a valid Zoom link beginning with http:// or https://." },
      { status: 400 },
    );
  }

  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const { data: serviceRequest, error: requestError } = await supabase
    .from("service_requests")
    .select("id,customer_name,customer_email,status")
    .eq("id", requestId)
    .single();

  if (requestError || !serviceRequest) {
    console.error("[admin-zoom-link] request lookup failed", {
      requestId,
      error: requestError,
    });
    return NextResponse.json(
      { error: "We could not find this service request." },
      { status: 404 },
    );
  }

  const customerEmail = read(serviceRequest.customer_email);

  if (!customerEmail) {
    return NextResponse.json(
      { error: "The service request does not have a customer email address." },
      { status: 400 },
    );
  }

  const appointmentResult = await findScheduledAppointment(requestId);

  if (appointmentResult.error || !appointmentResult.data) {
    console.error("[admin-zoom-link] appointment lookup failed", {
      requestId,
      error: appointmentResult.error,
    });
    return NextResponse.json(
      { error: "We could not find the scheduled consultation appointment." },
      { status: 404 },
    );
  }

  console.info("[admin-zoom-link] send attempt", {
    requestId,
    appointmentId: appointmentResult.data.id,
    recipientEmail: customerEmail,
    appointmentDate: appointmentResult.data.appointment_date,
    timeSlot: appointmentResult.data.time_window,
  });

  const emailResult = await sendConsultationZoomLinkEmail({
    serviceRequestId: requestId,
    appointmentId: read(appointmentResult.data.id),
    customerName: read(serviceRequest.customer_name),
    customerEmail,
    appointmentDate: read(appointmentResult.data.appointment_date),
    timeWindow: read(appointmentResult.data.time_window),
    zoomLink,
    optionalMessage,
  });

  if (!emailResult.sent) {
    const reason =
      "errorMessage" in emailResult && emailResult.errorMessage
        ? emailResult.errorMessage
        : "skippedReason" in emailResult && emailResult.skippedReason
          ? emailResult.skippedReason
          : "Email provider did not accept the message.";

    console.error("[admin-zoom-link] send failed", {
      requestId,
      appointmentId: appointmentResult.data.id,
      recipientEmail: customerEmail,
      reason,
    });

    return NextResponse.json(
      { success: false, error: reason },
      { status: 502 },
    );
  }

  const { error: zoomUpdateError } = await supabase
    .from("appointments")
    .update({
      zoom_link: zoomLink,
      updated_at: new Date().toISOString(),
    })
    .eq("id", appointmentResult.data.id);

  if (zoomUpdateError) {
    console.warn("[admin-zoom-link] appointment Zoom link update failed", {
      requestId,
      appointmentId: appointmentResult.data.id,
      error: zoomUpdateError,
    });
  }

  console.info("[admin-zoom-link] send succeeded", {
    requestId,
    appointmentId: appointmentResult.data.id,
    recipientEmail: customerEmail,
    providerResponseId: "id" in emailResult ? emailResult.id : undefined,
    providerStatus:
      "providerStatus" in emailResult ? emailResult.providerStatus : undefined,
  });

  return NextResponse.json({
    success: true,
    message: "Zoom link sent to customer.",
  });
}

async function findScheduledAppointment(requestId: string) {
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return { data: null, error: "Supabase is not configured." };
  }

  const primary = await supabase
    .from("appointments")
    .select("id,appointment_date,time_window,zoom_link,created_at")
    .eq("service_request_id", requestId)
    .neq("status", "Canceled")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!primary.error || !isMissingColumnError(primary.error)) {
    return primary;
  }

  return supabase
    .from("appointments")
    .select("id,appointment_date,time_window,created_at")
    .eq("service_request_id", requestId)
    .neq("status", "Canceled")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
}

function isValidZoomLink(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function isMissingColumnError(error: {
  code?: string;
  message?: string;
  details?: string | null;
}) {
  const searchable = `${error.code ?? ""} ${error.message ?? ""} ${error.details ?? ""}`;
  return (
    searchable.includes("PGRST204") ||
    searchable.toLowerCase().includes("zoom_link")
  );
}

function read(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
