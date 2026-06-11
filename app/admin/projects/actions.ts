"use server";

import { revalidatePath } from "next/cache";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { workflowStages } from "@/lib/workflow";

export async function updateProjectWorkflowStage(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  const workflowStage = String(formData.get("workflowStage") ?? "");

  if (!projectId || !workflowStages.includes(workflowStage as never)) {
    return;
  }

  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    console.error("[admin-projects] Supabase is not configured.");
    return;
  }

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id,customer_name,quote_number,service_type")
    .eq("id", projectId)
    .single();

  if (projectError || !project) {
    console.error("[admin-projects] Project lookup failed", projectError);
    return;
  }

  const { error: updateError } = await supabase
    .from("projects")
    .update({
      updated_at: new Date().toISOString(),
      workflow_stage: workflowStage,
    })
    .eq("id", projectId);

  if (updateError) {
    console.error("[admin-projects] Workflow stage update failed", updateError);
    return;
  }

  const { error: logError } = await supabase.from("crm_logs").insert({
    actor: "Admin",
    notes: `Project workflow stage updated to ${workflowStage}.`,
    related_quote_or_project: project.quote_number || project.id,
    status: workflowStage,
    type: "Project Update",
  });

  if (logError) {
    console.error("[admin-projects] CRM log insert failed", logError);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
}
