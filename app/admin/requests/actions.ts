"use server";

import { revalidatePath } from "next/cache";
import { queueOperationalEmail } from "@/lib/email";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

const allowedRequestActions = ["Reviewing", "Create Project"] as const;

type RequestAction = (typeof allowedRequestActions)[number];

export async function updateRequestAction(formData: FormData) {
  const requestId = String(formData.get("requestId") ?? "");
  const action = String(formData.get("action") ?? "") as RequestAction;

  if (!requestId || !allowedRequestActions.includes(action)) {
    return;
  }

  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    console.error("[admin-requests] Supabase is not configured.");
    return;
  }

  const { data: request, error: requestError } = await supabase
    .from("service_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (requestError || !request) {
    console.error("[admin-requests] Request lookup failed", requestError);
    return;
  }

  if (action === "Reviewing") {
    const { error: updateError } = await supabase
      .from("service_requests")
      .update({
        status: "Reviewing",
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    if (updateError) {
      console.error("[admin-requests] Request status update failed", updateError);
      return;
    }

    await sendCustomerEmail({
      email: request.customer_email,
      fullName: request.customer_name,
      subject: "Your Request Is Being Reviewed - Grubel Property Services",
      text: [
        `Hi ${request.customer_name},`,
        "",
        "Your project request is now being reviewed by Grubel Property Services.",
        "Our team is reviewing your property details, notes, and uploaded media to determine next steps.",
        "",
        "Grubel Property Services",
      ].join("\n"),
    });
  }

  if (action === "Create Project") {
    const { error: projectError } = await supabase.from("projects").insert({
      customer_id: request.customer_id,
      customer_name: request.customer_name,
      service_type: request.service_type,
      property_address: request.property_address,
      status: "Vendor Pricing",
      payment_status: "Unpaid",
      next_step: "Request vendor pricing and build project cost.",
      notes: request.project_description,
    });

    if (projectError) {
      console.error("[admin-requests] Project creation failed", projectError);
      return;
    }

    const { error: updateError } = await supabase
      .from("service_requests")
      .update({
        status: "Project Created",
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    if (updateError) {
      console.error("[admin-requests] Request status update failed", updateError);
      return;
    }

    await queueOperationalEmail({
      type: "internal_project_update",
      to: process.env.BUSINESS_EMAIL ?? "info@grubelps.com",
      subject: "Project Moved to Vendor Pricing - Grubel Property Services",
      text: [
        "A project has moved to Vendor Pricing.",
        "",
        `Customer: ${request.customer_name}`,
        `Service: ${request.service_type}`,
        `Property: ${request.property_address || "Not provided"}`,
      ].join("\n"),
      data: {
        requestId,
        customerName: request.customer_name,
        serviceType: request.service_type,
        status: "Vendor Pricing",
      },
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/requests");
  revalidatePath("/admin/projects");
}

async function sendCustomerEmail({
  email,
  fullName,
  subject,
  text,
}: {
  email?: string;
  fullName?: string;
  subject: string;
  text: string;
}) {
  if (!email) {
    return;
  }

  await queueOperationalEmail({
    type: "customer_status_update",
    to: email,
    subject,
    text,
    data: {
      customerName: fullName ?? "Customer",
      statusEmail: subject,
    },
  });
}
