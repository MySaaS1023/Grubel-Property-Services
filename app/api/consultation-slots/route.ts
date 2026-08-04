import { NextResponse } from "next/server";
import {
  type ConsultationSlot,
  type ConsultationSlotOverride,
  defaultProjectManagerName,
  generateConsultationSlots,
  getGeneratedSlotId,
  getSlotKey,
} from "@/lib/consultation-availability";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import {
  sendConsultationScheduledAdminEmail,
  sendConsultationScheduledCustomerEmail,
} from "@/lib/workflow-email-automation";
import {
  createZoomConsultationMeeting,
  isZoomConfigured,
  updateZoomConsultationMeeting,
} from "@/lib/zoom";

export async function GET() {
  const overrides = await loadAvailabilityOverrides();
  const slots = generateConsultationSlots({ overrides });
  const bookedSlotKeys = await loadBookedSlotKeys();

  return NextResponse.json({
    slots: slots
      .filter((slot) => !bookedSlotKeys.has(getSlotKey(slot.date, slot.timeWindow)))
      .map((slot) => ({
      ...slot,
      available: true,
    })),
    zoomConfigured: isZoomConfigured(),
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const requestId = typeof body?.requestId === "string" ? body.requestId.trim() : "";
  const slotId = typeof body?.slotId === "string" ? body.slotId.trim() : "";
  const overrides = await loadAvailabilityOverrides();
  const slots = generateConsultationSlots({ overrides });
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

  const existingCheck = await hasExistingAppointmentForSlot(slot, requestId);

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

  const warnings: string[] = [];
  const existingAppointment = await findActiveAppointmentForRequest(requestId);
  const existingAppointmentData = existingAppointment.data as Record<string, unknown> | null;
  const isReschedule = Boolean(existingAppointment.data?.id);

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
    property_address: serviceRequest.property_address,
    zoom_creation_status: "Pending",
    zoom_link: null,
    notes: "Project consultation scheduled. Zoom meeting creation pending.",
  };

  const appointmentResult = existingAppointment.data?.id
    ? await updateAppointmentWithFallback(existingAppointment.data.id, appointmentPayload)
    : await insertAppointmentWithFallback(appointmentPayload);

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
    rescheduled: isReschedule,
    usedFallback: appointmentResult.usedFallback,
  });

  const appointmentId = String(appointmentResult.data.id);
  const existingZoomMeetingId = read(existingAppointmentData?.zoom_meeting_id);
  const zoomResult = existingZoomMeetingId
    ? await updateZoomConsultationMeeting({
        date: slot.date,
        meetingId: existingZoomMeetingId,
        timeWindow: slot.timeWindow,
      })
    : await createZoomConsultationMeeting({
        appointmentId,
        customerName: serviceRequest.customer_name,
        date: slot.date,
        timeWindow: slot.timeWindow,
      });

  let zoomLink = read(existingAppointmentData?.zoom_join_url);

  if (zoomResult.success && "meeting" in zoomResult) {
    zoomLink = zoomResult.meeting.joinUrl;
    await updateAppointmentZoomFields({
      appointmentId,
      zoomCreationStatus: "Created",
      zoomJoinUrl: zoomResult.meeting.joinUrl,
      zoomMeetingId: zoomResult.meeting.id,
      zoomPassword: zoomResult.meeting.password,
      zoomStartUrl: zoomResult.meeting.startUrl,
    });
    console.info("[consultation-slots] Zoom meeting created", {
      appointmentId,
      meetingId: zoomResult.meeting.id,
      requestId,
    });
  } else if (zoomResult.success) {
    await updateAppointmentZoomFields({
      appointmentId,
      zoomCreationStatus: "Created",
      zoomJoinUrl: zoomLink,
      zoomMeetingId: existingZoomMeetingId,
    });
    console.info("[consultation-slots] Zoom meeting updated", {
      appointmentId,
      meetingId: existingZoomMeetingId,
      requestId,
    });
  } else {
    warnings.push("zoom_creation_failed");
    await updateAppointmentZoomFields({
      appointmentId,
      zoomCreationStatus: "Failed",
      zoomLastError: zoomResult.error,
      zoomMeetingId: existingZoomMeetingId,
      zoomJoinUrl: zoomLink,
    });
    console.error("[consultation-slots] Zoom meeting creation/update failed", {
      appointmentId,
      requestId,
      status: zoomResult.status,
      error: zoomResult.error,
    });
  }

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

  if (
    existingAppointmentData?.appointment_date &&
    existingAppointmentData?.time_window &&
    (existingAppointmentData.appointment_date !== slot.date ||
      existingAppointmentData.time_window !== slot.timeWindow)
  ) {
    await releaseAvailabilitySlot(
      String(existingAppointmentData.appointment_date),
      String(existingAppointmentData.time_window),
    );
  }

  await markAvailabilityBooked(slot);

  const emailContext = {
    serviceRequestId: requestId,
    appointmentId,
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

async function loadAvailabilityOverrides(): Promise<ConsultationSlotOverride[]> {
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("consultation_availability")
    .select("id,slot_date,time_window,project_manager_name,zoom_link,status")
    .order("slot_date", { ascending: true });

  if (error) {
    console.error("[consultation-slots] admin slot lookup failed; using generated defaults", {
      error,
    });
    return [];
  }

  return (data ?? []).map((slot) => ({
    id: String(slot.id),
    slot_date: String(slot.slot_date),
    time_window: String(slot.time_window),
    project_manager_name:
      typeof slot.project_manager_name === "string"
        ? slot.project_manager_name
        : defaultProjectManagerName,
    zoom_link: typeof slot.zoom_link === "string" ? slot.zoom_link : null,
    status: typeof slot.status === "string" ? slot.status : "Available",
  }));
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

async function hasExistingAppointmentForSlot(slot: ConsultationSlot, requestId: string) {
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
    .neq("service_request_id", requestId)
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
    .neq("service_request_id", requestId)
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
    .select("id,appointment_date,time_window,zoom_meeting_id,zoom_join_url")
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
    .select("id,appointment_date,time_window")
    .single();

  return { ...fallback, usedFallback: true };
}

async function updateAppointmentWithFallback(
  appointmentId: string,
  payload: Record<string, unknown>,
) {
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return { data: null, error: "Supabase is not configured.", usedFallback: false };
  }

  const primary = await supabase
    .from("appointments")
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq("id", appointmentId)
    .select("id,appointment_date,time_window,zoom_meeting_id,zoom_join_url")
    .single();

  if (!primary.error || !isMissingColumnError(primary.error)) {
    return { ...primary, usedFallback: false };
  }

  const fallbackPayload = {
    appointment_date: payload.appointment_date,
    notes: payload.notes,
    status: payload.status,
    time_window: payload.time_window,
    updated_at: new Date().toISOString(),
  };

  const fallback = await supabase
    .from("appointments")
    .update(fallbackPayload)
    .eq("id", appointmentId)
    .select("id,appointment_date,time_window")
    .single();

  return { ...fallback, usedFallback: true };
}

async function findActiveAppointmentForRequest(requestId: string) {
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return { data: null, error: "Supabase is not configured." };
  }

  const primary = await supabase
    .from("appointments")
    .select(
      "id,appointment_date,time_window,zoom_meeting_id,zoom_join_url,zoom_start_url,zoom_password,zoom_creation_status",
    )
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
    .select("id,appointment_date,time_window")
    .eq("service_request_id", requestId)
    .neq("status", "Canceled")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
}

async function updateAppointmentZoomFields({
  appointmentId,
  zoomCreationStatus,
  zoomJoinUrl,
  zoomLastError,
  zoomMeetingId,
  zoomPassword,
  zoomStartUrl,
}: {
  appointmentId: string;
  zoomCreationStatus: string;
  zoomJoinUrl?: string;
  zoomLastError?: string;
  zoomMeetingId?: string;
  zoomPassword?: string;
  zoomStartUrl?: string;
}) {
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return;
  }

  const { error } = await supabase
    .from("appointments")
    .update({
      updated_at: new Date().toISOString(),
      zoom_created_at: zoomCreationStatus === "Created" ? new Date().toISOString() : null,
      zoom_creation_status: zoomCreationStatus,
      zoom_join_url: zoomJoinUrl || null,
      zoom_last_error: zoomLastError || null,
      zoom_link: zoomJoinUrl || null,
      zoom_meeting_id: zoomMeetingId || null,
      zoom_password: zoomPassword || null,
      zoom_start_url: zoomStartUrl || null,
    })
    .eq("id", appointmentId);

  if (error && !isMissingColumnError(error)) {
    console.error("[consultation-slots] Zoom metadata update failed", {
      appointmentId,
      error,
    });
  }
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

async function markAvailabilityBooked(slot: ConsultationSlot) {
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return;
  }

  const { error: updateError } = await supabase
    .from("consultation_availability")
    .update({ status: "Booked", updated_at: new Date().toISOString() })
    .eq("slot_date", slot.date)
    .eq("time_window", slot.timeWindow);

  if (updateError && !isMissingColumnError(updateError)) {
    console.error("[consultation-slots] availability status update failed", {
      slot,
      error: updateError,
    });
  }

  const { data: existing, error: existingError } = await supabase
    .from("consultation_availability")
    .select("id")
    .eq("slot_date", slot.date)
    .eq("time_window", slot.timeWindow)
    .limit(1);

  if (existingError) {
    if (!isMissingColumnError(existingError)) {
      console.error("[consultation-slots] availability booked lookup failed", {
        slot,
        error: existingError,
      });
    }
    return;
  }

  if (existing?.length) {
    return;
  }

  const { error: insertError } = await supabase
    .from("consultation_availability")
    .insert({
      slot_date: slot.date,
      time_window: slot.timeWindow,
      project_manager_name: slot.projectManagerName || defaultProjectManagerName,
      zoom_link: slot.zoomLink ?? null,
      status: "Booked",
    });

  if (insertError && !isMissingColumnError(insertError)) {
    console.error("[consultation-slots] availability booked insert failed", {
      slotId: getGeneratedSlotId(slot.date, slot.timeWindow),
      slot,
      error: insertError,
    });
  }
}

async function releaseAvailabilitySlot(slotDate: string, timeWindow: string) {
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return;
  }

  const { error } = await supabase
    .from("consultation_availability")
    .update({ status: "Available", updated_at: new Date().toISOString() })
    .eq("slot_date", slotDate)
    .eq("time_window", timeWindow);

  if (error && !isMissingColumnError(error)) {
    console.error("[consultation-slots] previous slot release failed", {
      slotDate,
      timeWindow,
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
    searchable.toLowerCase().includes("zoom_meeting_id") ||
    searchable.toLowerCase().includes("zoom_join_url") ||
    searchable.toLowerCase().includes("zoom_start_url") ||
    searchable.toLowerCase().includes("zoom_password") ||
    searchable.toLowerCase().includes("zoom_creation_status") ||
    searchable.toLowerCase().includes("zoom_created_at") ||
    searchable.toLowerCase().includes("zoom_last_error") ||
    searchable.toLowerCase().includes("property_address") ||
    searchable.toLowerCase().includes("appointment_type") ||
    searchable.toLowerCase().includes("consultation_availability")
  );
}

function read(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
