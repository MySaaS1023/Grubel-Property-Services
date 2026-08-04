import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const profile = await getCurrentProfile("admin");

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 401 });
  }

  const appointmentId = new URL(request.url).searchParams.get("appointmentId")?.trim();

  if (!appointmentId) {
    return NextResponse.json({ error: "Appointment id is required." }, { status: 400 });
  }

  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("appointments")
    .select("id,zoom_start_url")
    .eq("id", appointmentId)
    .maybeSingle();

  if (error || !data?.zoom_start_url) {
    console.error("[admin-start-zoom] start URL lookup failed", {
      appointmentId,
      error,
      startUrlFound: Boolean(data?.zoom_start_url),
    });
    return NextResponse.json(
      { error: "Zoom start link is not available for this consultation." },
      { status: 404 },
    );
  }

  return NextResponse.redirect(data.zoom_start_url);
}
