"use server";

import { revalidatePath } from "next/cache";
import { isProjectStatus, type ProjectStatus } from "@/lib/operations-workflow";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import {
  sendAwaitingCustomerApprovalEmail,
  sendClosedCustomerEmail,
  sendCompletedCustomerEmail,
  sendInProgressCustomerEmail,
  sendScheduledCustomerEmail,
  sendScheduledVendorEmail,
  sendVendorPricingInternalEmail,
} from "@/lib/workflow-email-automation";

export async function updateProjectStatus(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  const status = String(formData.get("status") ?? "") as ProjectStatus;

  if (!projectId || !isProjectStatus(status)) {
    return;
  }

  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    console.error("[admin-projects] Supabase is not configured.");
    return;
  }

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (projectError || !project) {
    console.error("[admin-projects] Project lookup failed", projectError);
    return;
  }

  const { error: updateError } = await supabase
    .from("projects")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId);

  if (updateError) {
    console.error("[admin-projects] Project status update failed", updateError);
    return;
  }

  const customerEmail = read(project.customer_email, "") || await getCustomerEmail(project.customer_id);
  await sendStatusAutomation({
    customerEmail,
    project,
    status,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/finance");
}

async function getCustomerEmail(customerId: unknown) {
  if (typeof customerId !== "string" || !customerId) {
    return "";
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return "";
  }

  const { data, error } = await supabase
    .from("customers")
    .select("email")
    .eq("id", customerId)
    .single();

  if (error) {
    console.error("[admin-projects] Customer email lookup failed", error);
    return "";
  }

  return typeof data?.email === "string" ? data.email : "";
}

async function sendStatusAutomation({
  customerEmail,
  project,
  status,
}: {
  customerEmail: string;
  project: Record<string, unknown>;
  status: ProjectStatus;
}) {
  const customerName = read(project.customer_name, "Customer");
  const serviceType = read(project.service_type, "Project");
  const propertyAddress = read(project.property_address, "Property address not listed");
  const projectContext = {
    projectId: read(project.id, ""),
    customerName,
    customerEmail,
    serviceType,
    propertyAddress,
    assignedVendorName: read(project.assigned_team, ""),
    scheduledDate: read(project.scheduled_date, ""),
    status,
  };

  if (status === "Vendor Pricing") {
    await sendVendorPricingInternalEmail(projectContext);
    return;
  }

  if (status === "Scheduled") {
    const assignedVendorEmail = await getAssignedVendorEmail(project);

    await sendScheduledCustomerEmail(projectContext);
    await sendScheduledVendorEmail({
      ...projectContext,
      assignedVendorEmail,
    });
    return;
  }

  if (status === "Awaiting Customer Approval") {
    await sendAwaitingCustomerApprovalEmail(projectContext);
    return;
  }

  if (status === "In Progress") {
    await sendInProgressCustomerEmail(projectContext);
    return;
  }

  if (status === "Completed") {
    await sendCompletedCustomerEmail(projectContext);
    return;
  }

  if (status === "Closed") {
    await sendClosedCustomerEmail(projectContext);
  }
}

function read(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

async function getAssignedVendorEmail(project: Record<string, unknown>) {
  const directEmail = read(project.assigned_vendor_email, "");
  if (directEmail.includes("@")) {
    return directEmail;
  }

  const assignedVendorName = read(project.assigned_team, "");
  if (!assignedVendorName) {
    return "";
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return "";
  }

  const { data, error } = await supabase
    .from("subcontractors")
    .select("email,full_name,business_name");

  if (error) {
    console.error("[admin-projects] Assigned vendor lookup failed", error);
    return "";
  }

  const needle = assignedVendorName.trim().toLowerCase();
  const vendor = data?.find((subcontractor) => {
    const email = read(subcontractor.email, "").toLowerCase();
    const fullName = read(subcontractor.full_name, "").toLowerCase();
    const businessName = read(subcontractor.business_name, "").toLowerCase();
    return email === needle || fullName === needle || businessName === needle;
  });

  return read(vendor?.email, "");
}
