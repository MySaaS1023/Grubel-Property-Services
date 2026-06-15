"use server";

import { revalidatePath } from "next/cache";
import { queueOperationalEmail } from "@/lib/email";
import { isProjectStatus, type ProjectStatus } from "@/lib/operations-workflow";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

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

  if (status === "Vendor Pricing") {
    await queueOperationalEmail({
      type: "internal_project_update",
      to: process.env.BUSINESS_EMAIL ?? "info@grubelps.com",
      subject: "Project Entered Vendor Pricing - Grubel Property Services",
      text: [
        "A project is ready for vendor pricing.",
        "",
        `Customer: ${customerName}`,
        `Service: ${serviceType}`,
        `Property: ${propertyAddress}`,
      ].join("\n"),
      data: { projectId: project.id, status },
    });
    return;
  }

  if (status === "Scheduled") {
    await sendCustomerEmail({
      customerEmail,
      subject: "Your Project Has Been Scheduled - Grubel Property Services",
      text: [
        `Hi ${customerName},`,
        "",
        "Your project has been scheduled. Grubel Property Services will keep you updated as work begins.",
        "",
        `Service: ${serviceType}`,
        `Property: ${propertyAddress}`,
      ].join("\n"),
      status,
    });

    await queueOperationalEmail({
      type: "vendor_assignment_notification",
      to: process.env.BUSINESS_EMAIL ?? "info@grubelps.com",
      subject: "Vendor Assignment Needed - Grubel Property Services",
      text: [
        "A project has been scheduled. Confirm vendor assignment details.",
        "",
        `Customer: ${customerName}`,
        `Service: ${serviceType}`,
        `Property: ${propertyAddress}`,
        `Assigned Vendor: ${read(project.assigned_team, "Not assigned")}`,
      ].join("\n"),
      data: { projectId: project.id, status },
    });
    return;
  }

  const customerMessages: Partial<Record<ProjectStatus, { subject: string; body: string }>> = {
    "Awaiting Customer Approval": {
      subject: "Project Pricing Ready for Approval - Grubel Property Services",
      body: "Your project pricing is ready for review. Please review the scope and cost details from Grubel Property Services.",
    },
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
