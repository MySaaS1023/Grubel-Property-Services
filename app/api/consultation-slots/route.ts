import { NextResponse } from "next/server";
import { consultationSlots, getConsultationSlot } from "@/lib/consultation-availability";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import {
  sendConsultationScheduledAdminEmail,
  sendConsultationScheduledCustomerEmail,
} from "@/lib/workflow-email-automation";

export async function GET() {
  const supabase = createServiceSupabaseClient();
  const bookedSlotKeys = new Set<string>();

  if (supabase) {
    const { data, error } = await supabase
      .from("appointments")
      .select("appointment_date,time_window,status")
      .eq("appointment_type", "Project Consultation")
      .neq("status", "Canceled");

    if (error) {
      console.error("[consultation-slots] booked slot lookup failed", error);
    } else {
      for (const appointment of data ?? []) {
        bookedSlotKeys.add(
          getSlotKey(String(appointment.appointment_date), String(appointment.time_window)),
        );
      }
    }
  }

  return NextResponse.json({
    slots: consultationSlots.map((slot) => ({
      ...slot,
      available: !bookedSlotKeys.has(getSlotKey(slot.date, slot.timeWindow)),
    })),
    zoomConfigured: Boolean(process.env.ZOOM_CONSULTATION_LINK),
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const requestId = typeof body?.requestId === "string" ? body.requestId.trim() : "";
  const slotId = typeof body?.slotId === "string" ? body.slotId.trim() : "";
  const slot = getConsultationSlot(slotId);

  if (!requestId || !slot) {
    return NextResponse.json(
      { error: "A valid request and consultation time slot are required." },
      { status: 400 },
    );
  }

  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Scheduling is not configured yet." },
      { status: 500 },
    );
  }

  const { data: existingAppointments, error: existingError } = await supabase
    .from("appointments")
    .select("id")
    .eq("appointment_date", slot.date)
    .eq("time_window", slot.timeWindow)
    .eq("appointment_type", "Project Consultation")
    .neq("status", "Canceled");

  if (existingError) {
    console.error("[consultation-slots] double-booking check failed", existingError);
    return NextResponse.json(
      { error: "We could not confirm this time slot. Please try another time." },
      { status: 500 },
    );
  }

  if (existingAppointments?.length) {
    return NextResponse.json(
      { error: "This consultation time was just booked. Please choose another slot." },
      { status: 409 },
    );
  }

  const { data: serviceRequest, error: requestError } = await supabase
    .from("service_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (requestError || !serviceRequest) {
    console.error("[consultation-slots] service request lookup failed", requestError);
    return NextResponse.json(
      { error: "We could not find this project request." },
      { status: 404 },
    );
  }

  const zoomLink = process.env.ZOOM_CONSULTATION_LINK ?? "";
  const appointmentPayload = {
    customer_id: serviceRequest.customer_id,
    service_request_id: requestId,
    customer_name: serviceRequest.customer_name,
    customer_email: serviceRequest.customer_email,
    service_type: serviceRequest.service_type,
    appointment_date: slot.date,
    time_window: slot.timeWindow,
    contact_method: "Zoom",
    status: "Scheduled",
    appointment_type: "Project Consultation",
    confirmation_status: "Confirmed",
    project_manager_name: slot.projectManagerName,
    zoom_link: zoomLink || null,
    notes: zoomLink
      ? `Project consultation via Zoom: ${zoomLink}`
      : "Project consultation scheduled. Zoom link not configured.",
  };

  const appointmentResult = await insertAppointmentWithFallback(appointmentPayload);

  if (appointmentResult.error || !appointmentResult.data) {
    console.error("[consultation-slots] appointment insert failed", {
      error: appointmentResult.error,
      usedFallback: appointmentResult.usedFallback,
    });
    return NextResponse.json(
      { error: "We could not schedule this consultation. Please try again." },
      { status: 500 },
    );
  }

  const { error: updateError } = await supabase
    .from("service_requests")
    .update({
      status: "Consultation Scheduled",
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (updateError) {
    console.error("[consultation-slots] request status update failed", updateError);
  }

  const emailContext = {
    serviceRequestId: requestId,
    appointmentId: appointmentResult.data.id,
    customerName: serviceRequest.customer_name,
    customerEmail: serviceRequest.customer_email,
    serviceType: serviceRequest.service_type,
    propertyAddress: serviceRequest.property_address,
    appointmentDate: slot.date,
    timeWindow: slot.timeWindow,
    projectManagerName: slot.projectManagerName,
    zoomLink,
  };
  const warnings: string[] = [];

  try {
    const customerEmailResult =
      await sendConsultationScheduledCustomerEmail(emailContext);
    if (!customerEmailResult.sent) {
      warnings.push("customer_consultation_email_failed");
    }
  } catch (error) {
    warnings.push("customer_consultation_email_failed");
    console.error("[consultation-slots] customer consultation email failed", {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  try {
    const adminEmailResult = await sendConsultationScheduledAdminEmail(emailContext);
    if (!adminEmailResult.sent) {
      warnings.push("admin_consultation_email_failed");
    }
  } catch (error) {
    warnings.push("admin_consultation_email_failed");
    console.error("[consultation-slots] admin consultation email failed", {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  return NextResponse.json({
    success: true,
    appointmentId: appointmentResult.data.id,
    appointmentDate: slot.date,
    timeWindow: slot.timeWindow,
    projectManagerName: slot.projectManagerName,
    zoomLink,
    warning: warnings.length ? warnings.join(" ") : undefined,
  });
}

function getSlotKey(date: string, timeWindow: string) {
  return `${date}::${timeWindow}`.toLowerCase();
}

async function insertAppointmentWithFallback(payload: Record<string, unknown>) {
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return { data: null, error: "Supabase is not configured.", usedFallback: false };
  }

  const primary = await supabase
    .from("appointments")
    .insert(payload)
    .select("id")
    .single();

  if (!primary.error || !isMissingColumnError(primary.error)) {
    return { ...primary, usedFallback: false };
  }

  const fallbackPayload = { ...payload };
  delete fallbackPayload.customer_email;
  delete fallbackPayload.project_manager_name;
  delete fallbackPayload.zoom_link;

  const fallback = await supabase
    .from("appointments")
    .insert(fallbackPayload)
    .select("id")
    .single();

  return { ...fallback, usedFallback: true };
}

function isMissingColumnError(error: { code?: string; message?: string; details?: string | null }) {
  const searchable = `${error.code ?? ""} ${error.message ?? ""} ${error.details ?? ""}`;
  return (
    searchable.includes("PGRST204") ||
    searchable.toLowerCase().includes("customer_email") ||
    searchable.toLowerCase().includes("project_manager_name") ||
    searchable.toLowerCase().includes("zoom_link")
  );
}
