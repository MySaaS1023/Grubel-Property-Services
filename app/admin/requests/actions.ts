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

    const customerEmail =
      read(request.customer_email) ?? (await getCustomerEmail(request.customer_id));
    const emailResult = await sendReviewingStatusEmail({
      serviceRequestId: requestId,
      customerEmail,
      customerName: read(request.customer_name),
      serviceType: read(request.service_type),
      propertyAddress: read(request.property_address),
      projectDescription: read(request.project_description),
    });
    console.info("[admin-requests] Reviewing email automation result", {
      status: "Reviewing",
      templateName: "customer_status_update",
      recipientEmail: customerEmail,
      requestId,
      providerResponseId: "id" in emailResult ? emailResult.id : undefined,
      providerStatus:
        "providerStatus" in emailResult ? emailResult.providerStatus : undefined,
      sent: emailResult.sent,
      warning: emailResult.sent ? undefined : "reviewing_email_not_sent",
    });

    if (!emailResult.sent) {
      console.warn(
        "[admin-requests] Reviewing status was saved, but the customer email was not sent.",
      );
    }
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

async function getCustomerEmail(customerId: unknown) {
  if (typeof customerId !== "string" || !customerId) {
    return undefined;
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return undefined;
  }

  const { data, error } = await supabase
    .from("customers")
    .select("email")
    .eq("id", customerId)
    .maybeSingle();

  if (error) {
    console.error("[admin-requests] Customer email fallback lookup failed", error);
    return undefined;
  }

  return read(data?.email);
}
