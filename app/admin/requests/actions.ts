"use server";

import { revalidatePath } from "next/cache";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import {
  sendReviewingStatusEmail,
  sendVendorPricingInternalEmail,
} from "@/lib/workflow-email-automation";

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

    await sendReviewingStatusEmail({
      serviceRequestId: requestId,
      customerEmail: read(request.customer_email),
      customerName: read(request.customer_name),
      serviceType: read(request.service_type),
      propertyAddress: read(request.property_address),
      projectDescription: read(request.project_description),
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

    await sendVendorPricingInternalEmail({
      customerName: read(request.customer_name),
      serviceType: read(request.service_type),
      propertyAddress: read(request.property_address),
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/requests");
  revalidatePath("/admin/projects");
}

function read(value: unknown) {
  return typeof value === "string" ? value : undefined;
}
