import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { sendConsultationScheduledCustomerEmail } from "@/lib/workflow-email-automation";

export async function POST(request: Request) {
  const profile = await getCurrentProfile("admin");

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const appointmentId = read(body?.appointmentId);

  if (!appointmentId) {
    return NextResponse.json({ error: "Appointment id is required." }, { status: 400 });
  }

  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const { data: appointment, error } = await supabase
    .from("appointments")
    .select(
      "id,service_request_id,customer_name,customer_email,service_type,appointment_date,time_window,project_manager_name,zoom_join_url,zoom_link",
    )
    .eq("id", appointmentId)
    .maybeSingle();

  if (error || !appointment) {
    console.error("[admin-resend-meeting-email] appointment lookup failed", {
      appointmentId,
      error,
    });
    return NextResponse.json(
      { error: "We could not find this consultation appointment." },
      { status: 404 },
    );
  }

  const zoomLink = read(appointment.zoom_join_url) || read(appointment.zoom_link);

  if (!zoomLink) {
    return NextResponse.json(
      { error: "This consultation does not have a customer Zoom join link yet." },
      { status: 400 },
    );
  }

  const emailResult = await sendConsultationScheduledCustomerEmail({
    appointmentDate: read(appointment.appointment_date),
    appointmentId,
    customerEmail: read(appointment.customer_email),
    customerName: read(appointment.customer_name),
    projectManagerName: read(appointment.project_manager_name),
    serviceRequestId: read(appointment.service_request_id),
    serviceType: read(appointment.service_type),
    timeWindow: read(appointment.time_window),
    zoomLink,
  });

  if (!emailResult.sent) {
    return NextResponse.json(
      { error: "Meeting email could not be sent." },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true, message: "Meeting email resent." });
}

function read(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
