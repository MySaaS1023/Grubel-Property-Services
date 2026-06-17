import { NextResponse } from "next/server";
import {
  type ConsultationSlot,
  consultationSlots,
  getSlotKey,
} from "@/lib/consultation-availability";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import {
  sendConsultationScheduledAdminEmail,
  sendConsultationScheduledCustomerEmail,
} from "@/lib/workflow-email-automation";

export async function GET() {
  const slots = await loadConsultationSlots();
  const bookedSlotKeys = await loadBookedSlotKeys();

  return NextResponse.json({
    slots: slots.map((slot) => ({
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
  const slots = await loadConsultationSlots();
  const slot = slots.find((item) => item.id === slotId);

  console.log("[consultation-slots] booking request received", {
    requestId: requestId || "missing",
    slotId: slotId || "missing",
    slotFound: Boolean(slot),
    timestamp: new Date().toISOString(),
  });

  if (!requestId || !slot) {
    return NextResponse.json(
      {
        error:
          "A valid request and consultation time slot are required. Please use the scheduling link from your confirmation email.",
      },
      { status: 400 },
    );
  }

  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    console.error("[consultation-slots] booking failed: Supabase not configured");
    return NextResponse.json(
      { error: "Scheduling is not configured yet. Please contact Grubel Property Services." },
      { status: 500 },
    );
  }

  console.log("[consultation-slots] selected slot", {
    slotId: slot.id,
    date: slot.date,
    timeWindow: slot.timeWindow,
    projectManagerName: slot.projectManagerName,
  });

  const existingCheck = await hasExistingAppointmentForSlot(slot);

  if (existingCheck.error) {
    console.error("[consultation-slots] double-booking check failed", existingCheck.error);
    return NextResponse.json(
      {
        error:
          "We could not verify this consultation time. Please refresh and try again, or contact Grubel Property Services.",
      },
      { status: 500 },
    );
  }

  if (existingCheck.exists) {
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
    console.error("[consultation-slots] service request lookup failed", {
      requestId,
      error: requestError,
    });
    return NextResponse.json(
      {
        error:
          "We could not find this project request. Please use the scheduling link from your confirmation email.",
      },
      { status: 404 },
    );
  }

  const zoomLink = slot.zoomLink || process.env.ZOOM_CONSULTATION_LINK || "";
  const warnings: string[] = [];

  if (!zoomLink) {
    warnings.push("zoom_link_missing");
    console.warn("[consultation-slots] Zoom link missing for booked consultation", {
      requestId,
      slotId: slot.id,
      date: slot.date,
      timeSlot: slot.timeWindow,
    });
  }

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
      requestId,
      slotId: slot.id,
      date: slot.date,
      timeWindow: slot.timeWindow,
      error: appointmentResult.error,
      usedFallback: appointmentResult.usedFallback,
    });
    return NextResponse.json(
      {
        error:
          "We could not save this consultation appointment. Please contact Grubel Property Services so we can schedule it manually.",
      },
      { status: 500 },
    );
  }

  console.log("[consultation-slots] appointment insert succeeded", {
    appointmentId: appointmentResult.data.id,
    usedFallback: appointmentResult.usedFallback,
  });

  const { error: updateError } = await supabase
    .from("service_requests")
    .update({
      status: "Consultation Scheduled",
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (updateError) {
    console.error("[consultation-slots] request status update failed", {
      requestId,
      error: updateError,
    });
  } else {
    console.log("[consultation-slots] request status updated", {
      requestId,
      status: "Consultation Scheduled",
    });
  }

  await markAvailabilityBooked(slot.id);

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

async function loadConsultationSlots(): Promise<ConsultationSlot[]> {
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return consultationSlots;
  }

  const { data, error } = await supabase
    .from("consultation_availability")
    .select("id,slot_date,time_window,project_manager_name,zoom_link,status")
    .order("slot_date", { ascending: true });

  if (error) {
    console.error("[consultation-slots] admin slot lookup failed; using static fallback", {
      error,
    });
    return consultationSlots;
  }

  const allSlots = data ?? [];
  const adminSlots = allSlots
    .filter((slot) => String(slot.status ?? "Available") === "Available")
    .map((slot) => ({
      id: String(slot.id),
      date: String(slot.slot_date),
      timeWindow: String(slot.time_window),
      projectManagerName: String(slot.project_manager_name ?? "Grubel Project Manager"),
      zoomLink: typeof slot.zoom_link === "string" ? slot.zoom_link : undefined,
    }));

  return allSlots.length ? adminSlots : consultationSlots;
}

async function loadBookedSlotKeys() {
  const supabase = createServiceSupabaseClient();
  const bookedSlotKeys = new Set<string>();

  if (supabase) {
    const { data, error } = await selectAppointmentsWithFallback();

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

  return bookedSlotKeys;
}

async function hasExistingAppointmentForSlot(slot: ConsultationSlot) {
  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return { exists: false, error: null };
  }

  const primary = await supabase
    .from("appointments")
    .select("id")
    .eq("appointment_date", slot.date)
    .eq("time_window", slot.timeWindow)
    .eq("appointment_type", "Project Consultation")
    .neq("status", "Canceled");

  if (!primary.error) {
    return { exists: Boolean(primary.data?.length), error: null };
  }

  if (!isMissingColumnError(primary.error)) {
    return { exists: false, error: primary.error };
  }

  const fallback = await supabase
    .from("appointments")
    .select("id")
    .eq("appointment_date", slot.date)
    .eq("time_window", slot.timeWindow)
    .neq("status", "Canceled");

  return fallback.error
    ? { exists: false, error: fallback.error }
    : { exists: Boolean(fallback.data?.length), error: null };
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

  const fallbackPayload = {
    customer_id: payload.customer_id,
    service_request_id: payload.service_request_id,
    customer_name: payload.customer_name,
    service_type: payload.service_type,
    appointment_date: payload.appointment_date,
    time_window: payload.time_window,
    status: payload.status,
    notes: payload.notes,
  };

  const fallback = await supabase
    .from("appointments")
    .insert(fallbackPayload)
    .select("id")
    .single();

  return { ...fallback, usedFallback: true };
}

async function selectAppointmentsWithFallback() {
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return { data: [], error: null };
  }

  const primary = await supabase
    .from("appointments")
    .select("appointment_date,time_window,status,appointment_type")
    .eq("appointment_type", "Project Consultation")
    .neq("status", "Canceled");

  if (!primary.error || !isMissingColumnError(primary.error)) {
    return primary;
  }

  return supabase
    .from("appointments")
    .select("appointment_date,time_window,status")
    .neq("status", "Canceled");
}

async function markAvailabilityBooked(slotId: string) {
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return;
  }

  const { error } = await supabase
    .from("consultation_availability")
    .update({ status: "Booked", updated_at: new Date().toISOString() })
    .eq("id", slotId);

  if (error && !isMissingColumnError(error)) {
    console.error("[consultation-slots] availability status update failed", {
      slotId,
      error,
    });
  }
}

function isMissingColumnError(error: { code?: string; message?: string; details?: string | null }) {
  const searchable = `${error.code ?? ""} ${error.message ?? ""} ${error.details ?? ""}`;
  return (
    searchable.includes("PGRST204") ||
    searchable.toLowerCase().includes("customer_email") ||
    searchable.toLowerCase().includes("project_manager_name") ||
    searchable.toLowerCase().includes("zoom_link") ||
    searchable.toLowerCase().includes("appointment_type") ||
    searchable.toLowerCase().includes("consultation_availability")
  );
}
