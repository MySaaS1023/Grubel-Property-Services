"use server";

import { revalidatePath } from "next/cache";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

const validStatuses = new Set(["Available", "Unavailable", "Booked"]);

export async function addAvailabilitySlot(formData: FormData) {
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    console.error("[admin-availability] Supabase is not configured.");
    return;
  }

  const slotDate = read(formData.get("slotDate"));
  const timeWindow = read(formData.get("timeWindow"));
  const projectManagerName =
    read(formData.get("projectManagerName")) || "Grubel Project Manager";
  const zoomLink = read(formData.get("zoomLink"));

  if (!slotDate || !timeWindow) {
    console.error("[admin-availability] Add slot blocked: date and time required.");
    return;
  }

  const { error } = await supabase.from("consultation_availability").insert({
    slot_date: slotDate,
    time_window: timeWindow,
    project_manager_name: projectManagerName,
    zoom_link: zoomLink || null,
    status: "Available",
  });

  if (error) {
    console.error("[admin-availability] Add slot failed", error);
    return;
  }

  revalidatePath("/admin/availability");
  revalidatePath("/schedule-consultation");
}

export async function updateAvailabilitySlot(formData: FormData) {
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    console.error("[admin-availability] Supabase is not configured.");
    return;
  }

  const slotId = read(formData.get("slotId"));
  const slotDate = read(formData.get("slotDate"));
  const timeWindow = read(formData.get("timeWindow"));
  const projectManagerName =
    read(formData.get("projectManagerName")) || "Grubel Project Manager";
  const zoomLink = read(formData.get("zoomLink"));
  const status = read(formData.get("status")) || "Available";

  if (!slotId || !slotDate || !timeWindow || !validStatuses.has(status)) {
    console.error("[admin-availability] Update slot blocked: invalid payload.", {
      slotId,
      slotDate,
      timeWindow,
      status,
    });
    return;
  }

  const { error } = await supabase
    .from("consultation_availability")
    .update({
      slot_date: slotDate,
      time_window: timeWindow,
      project_manager_name: projectManagerName,
      zoom_link: zoomLink || null,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", slotId);

  if (error) {
    console.error("[admin-availability] Update slot failed", error);
    return;
  }

  revalidatePath("/admin/availability");
  revalidatePath("/schedule-consultation");
}

export async function deleteAvailabilitySlot(formData: FormData) {
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    console.error("[admin-availability] Supabase is not configured.");
    return;
  }

  const slotId = read(formData.get("slotId"));

  if (!slotId) {
    return;
  }

  const { error } = await supabase
    .from("consultation_availability")
    .delete()
    .eq("id", slotId);

  if (error) {
    console.error("[admin-availability] Delete slot failed", error);
    return;
  }

  revalidatePath("/admin/availability");
  revalidatePath("/schedule-consultation");
}

function read(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}
