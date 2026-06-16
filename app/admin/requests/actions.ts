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
  const timestamp = new Date().toISOString();

  console.info("[admin-requests][reviewing-debug] action received", {
    requestId,
    requestedAction: action,
    timestamp,
  });

  if (!requestId || !allowedRequestActions.includes(action)) {
    console.warn("[admin-requests][reviewing-debug] action ignored", {
      requestId,
      requestedAction: action,
      reason: "missing request id or unsupported action",
      timestamp,
    });
    return;
  }

  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    console.error("[admin-requests][reviewing-debug] Supabase is not configured.", {
      requestId,
      requestedAction: action,
      timestamp,
    });
    return;
  }

  const { data: request, error: requestError } = await supabase
    .from("service_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (requestError || !request) {
    console.error("[admin-requests][reviewing-debug] Request lookup failed", {
      requestId,
      requestedAction: action,
      timestamp,
      error: requestError,
    });
    return;
  }

  if (action === "Reviewing") {
    const currentStatus = read(request.status);
    console.info("[admin-requests][reviewing-debug] Reviewing action executing", {
      requestId,
      currentStatus,
      newStatus: "Reviewing",
      timestamp,
      alreadyReviewing: currentStatus === "Reviewing",
    });

    const { error: updateError } = await supabase
      .from("service_requests")
      .update({
        status: "Reviewing",
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    if (updateError) {
      console.error("[admin-requests][reviewing-debug] Request status update failed", {
        requestId,
        currentStatus,
        newStatus: "Reviewing",
        timestamp,
        error: updateError,
      });
      return;
    }

    console.info("[admin-requests][reviewing-debug] Request status update saved", {
      requestId,
      previousStatus: currentStatus,
      newStatus: "Reviewing",
      timestamp: new Date().toISOString(),
    });

    const requestCustomerEmail = read(request.customer_email);
    const fallbackCustomerEmail = requestCustomerEmail
      ? undefined
      : await getCustomerEmail(request.customer_id, requestId);
    const customerEmail = requestCustomerEmail ?? fallbackCustomerEmail;
    const emailSource = requestCustomerEmail
      ? "service_requests.customer_email"
      : fallbackCustomerEmail
        ? "customers.email fallback"
        : "missing customer email";
    const customerName = read(request.customer_name);

    console.info("[admin-requests][reviewing-debug] Customer email resolved", {
      requestId,
      customerEmail,
      emailSource,
      customerName,
      timestamp: new Date().toISOString(),
    });

    console.info("[admin-requests][reviewing-debug] Calling workflow email automation", {
      requestId,
      template: "Reviewing",
      recipientEmail: customerEmail,
      customerName,
      timestamp: new Date().toISOString(),
    });

    const emailResult = await sendReviewingStatusEmail({
      serviceRequestId: requestId,
      customerEmail,
      customerName,
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
      safeError:
        "errorMessage" in emailResult ? emailResult.errorMessage : undefined,
      skippedReason:
        "skippedReason" in emailResult ? emailResult.skippedReason : undefined,
      sent: emailResult.sent,
      warning: emailResult.sent ? undefined : getReviewingEmailWarning(emailResult),
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

async function getCustomerEmail(customerId: unknown, requestId: string) {
  if (typeof customerId !== "string" || !customerId) {
    console.warn("[admin-requests][reviewing-debug] Customer fallback skipped", {
      requestId,
      reason: "missing customer_id",
    });
    return undefined;
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    console.warn("[admin-requests][reviewing-debug] Customer fallback skipped", {
      requestId,
      reason: "Supabase is not configured",
    });
    return undefined;
  }

  const { data, error } = await supabase
    .from("customers")
    .select("email")
    .eq("id", customerId)
    .maybeSingle();

  if (error) {
    console.error("[admin-requests][reviewing-debug] Customer email fallback lookup failed", {
      requestId,
      customerId,
      error,
    });
    return undefined;
  }

  const email = read(data?.email);
  console.info("[admin-requests][reviewing-debug] Customer fallback lookup result", {
    requestId,
    customerId,
    customerEmail: email,
  });

  return email;
}

function getReviewingEmailWarning(emailResult: {
  sent: boolean;
  skipped?: boolean;
  skippedReason?: string;
  errorMessage?: string;
}) {
  if (emailResult.sent) {
    return undefined;
  }

  if (emailResult.skippedReason) {
    return emailResult.skippedReason;
  }

  if (emailResult.errorMessage) {
    return emailResult.errorMessage;
  }

  if (emailResult.skipped) {
    return "email skipped";
  }

  return "reviewing_email_not_sent";
}
