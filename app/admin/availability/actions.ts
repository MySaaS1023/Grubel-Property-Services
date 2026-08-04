"use server";

import { revalidatePath } from "next/cache";
import {
  dayBlockTimeWindow,
  defaultProjectManagerName,
} from "@/lib/consultation-availability";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

const validStatuses = new Set(["Available", "Unavailable", "Booked"]);

export async function saveAvailabilitySlot(formData: FormData) {
  const slotDate = read(formData.get("slotDate"));
  const timeWindow = read(formData.get("timeWindow"));
  const projectManagerName =
    read(formData.get("projectManagerName")) || defaultProjectManagerName;
  const zoomLink = read(formData.get("zoomLink"));
  const status = read(formData.get("status")) || "Available";

  if (!slotDate || !timeWindow || !validStatuses.has(status)) {
    console.error("[admin-availability] Save slot blocked: invalid payload.", {
      slotDate,
      timeWindow,
      status,
    });
    return;
  }

  await upsertAvailabilityOverride({
    projectManagerName,
    slotDate,
    status,
    timeWindow,
    zoomLink,
  });
}

export async function blockAvailabilitySlot(formData: FormData) {
  const slotDate = read(formData.get("slotDate"));
  const timeWindow = read(formData.get("timeWindow"));

  if (!slotDate || !timeWindow) {
    return;
  }

  await upsertAvailabilityOverride({
    projectManagerName: defaultProjectManagerName,
    slotDate,
    status: "Unavailable",
    timeWindow,
    zoomLink: "",
  });
}

export async function unblockAvailabilitySlot(formData: FormData) {
  const slotDate = read(formData.get("slotDate"));
  const timeWindow = read(formData.get("timeWindow"));

  if (!slotDate || !timeWindow) {
    return;
  }

  await upsertAvailabilityOverride({
    projectManagerName: defaultProjectManagerName,
    slotDate,
    status: "Available",
    timeWindow,
    zoomLink: "",
  });
}

export async function blockAvailabilityDay(formData: FormData) {
  const slotDate = read(formData.get("slotDate"));

  if (!slotDate) {
    return;
  }

  await upsertAvailabilityOverride({
    projectManagerName: defaultProjectManagerName,
    slotDate,
    status: "Unavailable",
    timeWindow: dayBlockTimeWindow,
    zoomLink: "",
  });
}

export async function unblockAvailabilityDay(formData: FormData) {
  const supabase = createServiceSupabaseClient();
  const slotDate = read(formData.get("slotDate"));

  if (!supabase || !slotDate) {
    return;
  }

  const { error } = await supabase
    .from("consultation_availability")
    .delete()
    .eq("slot_date", slotDate)
    .eq("time_window", dayBlockTimeWindow);

  if (error) {
    console.error("[admin-availability] Unblock day failed", { slotDate, error });
  }

  refreshAvailabilityPaths();
}

export async function cancelConsultationBooking(formData: FormData) {
  const supabase = createServiceSupabaseClient();
  const appointmentId = read(formData.get("appointmentId"));
  const slotDate = read(formData.get("slotDate"));
  const timeWindow = read(formData.get("timeWindow"));

  if (!supabase || !appointmentId) {
    return;
  }

  const { error } = await supabase
    .from("appointments")
    .update({
      status: "Canceled",
      updated_at: new Date().toISOString(),
    })
    .eq("id", appointmentId);

  if (error) {
    console.error("[admin-availability] Cancel booking failed", {
      appointmentId,
      error,
    });
    return;
  }

  if (slotDate && timeWindow) {
    await upsertAvailabilityOverride({
      projectManagerName: defaultProjectManagerName,
      slotDate,
      status: "Available",
      timeWindow,
      zoomLink: "",
    });
  }

  refreshAvailabilityPaths();
}

async function upsertAvailabilityOverride({
  projectManagerName,
  slotDate,
  status,
  timeWindow,
  zoomLink,
}: {
  projectManagerName: string;
  slotDate: string;
  status: string;
  timeWindow: string;
  zoomLink: string;
}) {
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    console.error("[admin-availability] Supabase is not configured.");
    return;
  }

  const { data: existing, error: lookupError } = await supabase
    .from("consultation_availability")
    .select("id")
    .eq("slot_date", slotDate)
    .eq("time_window", timeWindow)
    .limit(1);

  if (lookupError) {
    console.error("[admin-availability] Override lookup failed", {
      slotDate,
      timeWindow,
      error: lookupError,
    });
    return;
  }

  if (existing?.length) {
    const { error } = await supabase
      .from("consultation_availability")
      .update({
        project_manager_name: projectManagerName,
        status,
        updated_at: new Date().toISOString(),
        zoom_link: zoomLink || null,
      })
      .eq("id", existing[0].id);

    if (error) {
      console.error("[admin-availability] Override update failed", {
        slotDate,
        timeWindow,
        error,
      });
      return;
    }
  } else {
    const { error } = await supabase.from("consultation_availability").insert({
      project_manager_name: projectManagerName,
      slot_date: slotDate,
      status,
      time_window: timeWindow,
      zoom_link: zoomLink || null,
    });

    if (error) {
      console.error("[admin-availability] Override insert failed", {
        slotDate,
        timeWindow,
        error,
      });
      return;
    }
  }

  refreshAvailabilityPaths();
}

function refreshAvailabilityPaths() {
  revalidatePath("/admin/availability");
  revalidatePath("/schedule-consultation");
}

function read(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}
