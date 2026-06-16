"use server";

import { revalidatePath } from "next/cache";
import { queueOperationalEmail } from "@/lib/email";
import { isProjectStatus, type ProjectStatus } from "@/lib/operations-workflow";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import {
  sendAwaitingCustomerApprovalEmail,
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

  const customerEmail = await getCustomerEmail(project.customer_id);
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

  const customerMessages: Partial<Record<ProjectStatus, { subject: string; body: string }>> = {
    "In Progress": {
      subject: "Your Project Has Started - Grubel Property Services",
      body: "Work has started on your project. We will continue to keep you updated.",
    },
    Completed: {
      subject: "Your Project Is Complete - Grubel Property Services",
      body: "Your project work has been completed. Grubel Property Services will follow up with any final closeout details.",
    },
    Closed: {
      subject: "Thank You - Grubel Property Services",
      body: "Thank you for working with Grubel Property Services. Your project has been closed.",
    },
  };
  const message = customerMessages[status];

  if (message) {
    await sendCustomerEmail({
      customerEmail,
      subject: message.subject,
      text: [
        `Hi ${customerName},`,
        "",
        message.body,
        "",
        `Service: ${serviceType}`,
        `Property: ${propertyAddress}`,
      ].join("\n"),
      status,
    });
  }
}

async function sendCustomerEmail({
  customerEmail,
  subject,
  text,
  status,
}: {
  customerEmail: string;
  subject: string;
  text: string;
  status: ProjectStatus;
}) {
  if (!customerEmail) {
    console.error("[admin-projects] Customer status email skipped: missing email", {
      status,
    });
    return;
  }

  await queueOperationalEmail({
    type: "customer_status_update",
    to: customerEmail,
    subject,
    text,
    data: { status },
  });
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
