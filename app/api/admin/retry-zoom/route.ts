import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { createZoomConsultationMeeting } from "@/lib/zoom";

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
      "id,customer_name,appointment_date,time_window,zoom_meeting_id,zoom_join_url",
    )
    .eq("id", appointmentId)
    .maybeSingle();

  if (error || !appointment) {
    console.error("[admin-retry-zoom] appointment lookup failed", {
      appointmentId,
      error,
    });
    return NextResponse.json(
      { error: "We could not find this consultation appointment." },
      { status: 404 },
    );
  }

  if (read(appointment.zoom_meeting_id) && read(appointment.zoom_join_url)) {
    return NextResponse.json({
      success: true,
      message: "Zoom meeting already exists.",
    });
  }

  const zoomResult = await createZoomConsultationMeeting({
    appointmentId,
    customerName: read(appointment.customer_name),
    date: read(appointment.appointment_date),
    timeWindow: read(appointment.time_window),
  });

  if (!zoomResult.success) {
    await supabase
      .from("appointments")
      .update({
        updated_at: new Date().toISOString(),
        zoom_creation_status: "Failed",
        zoom_last_error: zoomResult.error,
      })
      .eq("id", appointmentId);

    return NextResponse.json(
      { error: zoomResult.error },
      { status: 502 },
    );
  }

  const { error: updateError } = await supabase
    .from("appointments")
    .update({
      updated_at: new Date().toISOString(),
      zoom_created_at: new Date().toISOString(),
      zoom_creation_status: "Created",
      zoom_join_url: zoomResult.meeting.joinUrl,
      zoom_last_error: null,
      zoom_link: zoomResult.meeting.joinUrl,
      zoom_meeting_id: zoomResult.meeting.id,
      zoom_password: zoomResult.meeting.password ?? null,
      zoom_start_url: zoomResult.meeting.startUrl,
    })
    .eq("id", appointmentId);

  if (updateError) {
    console.error("[admin-retry-zoom] Zoom metadata update failed", {
      appointmentId,
      error: updateError,
    });
    return NextResponse.json(
      { error: "Zoom meeting was created but could not be saved." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    message: "Zoom meeting created.",
  });
}

function read(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
