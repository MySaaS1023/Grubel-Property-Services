"use server";

import { revalidatePath } from "next/cache";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

type SubcontractorApplicationStatus =
  | "Approved"
  | "Denied"
  | "More Info Requested";

export async function updateSubcontractorApplicationStatus(formData: FormData) {
  const applicationId = String(formData.get("applicationId") ?? "");
  const status = String(formData.get("status") ?? "") as SubcontractorApplicationStatus;

  if (
    !applicationId ||
    !["Approved", "Denied", "More Info Requested"].includes(status)
  ) {
    return;
  }

  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    console.error("[admin-subcontractors] Supabase is not configured.");
    return;
  }

  const { data: application, error: applicationError } = await supabase
    .from("subcontractor_applications")
    .select("*")
    .eq("id", applicationId)
    .single();

  if (applicationError || !application) {
    console.error("[admin-subcontractors] Application lookup failed", applicationError);
    return;
  }

  const { error: updateError } = await supabase
    .from("subcontractor_applications")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", applicationId);

  if (updateError) {
    console.error("[admin-subcontractors] Application status update failed", updateError);
    return;
  }

  if (status === "Approved") {
    const { error: subcontractorError } = await supabase
      .from("subcontractors")
      .upsert(
        {
          availability: "Pending onboarding",
          business_name: application.company_name || null,
          email: application.email,
          full_name: application.applicant_name,
          phone: application.phone,
          service_areas: splitList(application.service_areas),
          status: "Approved",
          trade_skills: splitList(application.services_offered),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "email" },
      );

    if (subcontractorError) {
      console.error(
        "[admin-subcontractors] Approved subcontractor upsert failed",
        subcontractorError,
      );
    }
  }

  const { error: logError } = await supabase.from("crm_logs").insert({
    actor: "Admin",
    notes: `Subcontractor application for ${application.applicant_name} updated to ${status}.`,
    related_quote_or_project: applicationId,
    status,
    type: "Subcontractor Action",
  });

  if (logError) {
    console.error("[admin-subcontractors] CRM log insert failed", logError);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/subcontractors");
}

function splitList(value: unknown) {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
