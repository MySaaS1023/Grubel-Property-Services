import { Resend } from "resend";

type EmailType =
  | "new_service_request"
  | "quote_issued"
  | "payment_received"
  | "appointment_scheduled"
  | "project_scheduled"
  | "subcontractor_application_received"
  | "job_assignment_notification"
  | "contact_message"
  | "customer_status_update"
  | "internal_project_update"
  | "vendor_assignment_notification";

type EmailPayload = {
  type: EmailType;
  to?: string;
  from?: string;
  subject: string;
  text?: string;
  data: Record<string, unknown>;
};

export type EmailSendResult = {
  queued: boolean;
  sent: boolean;
  id?: string;
  provider: "resend";
  templateName: EmailType;
  recipientEmail: string;
  fromEmail: string;
  requestId?: string;
  projectId?: string;
  skippedReason?: string;
  errorMessage?: string;
  providerStatus?: string;
};

export async function queueOperationalEmail(payload: EmailPayload) {
  const businessEmail = process.env.BUSINESS_EMAIL ?? "info@grubelps.com";
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    payload.from ??
    process.env.FROM_EMAIL ??
    "Grubel Property Services <onboarding@resend.dev>";
  const to = payload.to ?? businessEmail;
  const requestId = getString(payload.data.serviceRequestId ?? payload.data.requestId);
  const projectId = getString(payload.data.projectId);

  console.info("[email] send attempt", {
    provider: "resend",
    templateName: payload.type,
    recipientEmail: to,
    fromEmail,
    requestId,
    projectId,
    resendApiKeyExists: Boolean(resendApiKey),
    businessEmail,
    fromEmailUsesResendSandbox: fromEmail.includes("onboarding@resend.dev"),
  });

  if (resendApiKey) {
    const resend = new Resend(resendApiKey);

    const result = await resend.emails.send({
      from: fromEmail,
      to,
      subject: payload.subject,
      text: payload.text ?? formatEmailText(payload),
    });

    if (result.error) {
      const errorMessage = getProviderErrorMessage(result.error);
      console.error("[email] send failed", {
        provider: "resend",
        templateName: payload.type,
        recipientEmail: to,
        fromEmail,
        requestId,
        projectId,
        errorMessage,
      });
      return {
        queued: true,
        sent: false,
        provider: "resend",
        templateName: payload.type,
        recipientEmail: to,
        fromEmail,
        requestId,
        projectId,
        providerStatus: "error",
        errorMessage,
      } satisfies EmailSendResult;
    }

    console.info("[email] send accepted", {
      provider: "resend",
      templateName: payload.type,
      recipientEmail: to,
      fromEmail,
      requestId,
      projectId,
      providerResponseId: result.data?.id,
      providerStatus: "accepted",
    });
    return {
      queued: true,
      sent: true,
      id: result.data?.id,
      provider: "resend",
      templateName: payload.type,
      recipientEmail: to,
      fromEmail,
      requestId,
      projectId,
      providerStatus: "accepted",
    } satisfies EmailSendResult;
  }

  console.info("[email] send skipped", {
    provider: "resend",
    type: payload.type,
    templateName: payload.type,
    recipientEmail: to,
    fromEmail,
    requestId,
    projectId,
    subject: payload.subject,
    skippedReason: "RESEND_API_KEY is not configured",
  });

  return {
    queued: true,
    sent: false,
    provider: "resend",
    templateName: payload.type,
    recipientEmail: to,
    fromEmail,
    requestId,
    projectId,
    skippedReason: "RESEND_API_KEY is not configured",
    providerStatus: "skipped",
  } satisfies EmailSendResult;
}

function formatEmailText(payload: EmailPayload) {
  return [
    payload.subject,
    "",
    `Event: ${payload.type}`,
    "",
    JSON.stringify(payload.data, null, 2),
  ].join("\n");
}

function getString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function getProviderErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error) {
    const maybeMessage = "message" in error ? error.message : undefined;
    if (typeof maybeMessage === "string") {
      return maybeMessage;
    }
  }

  return String(error);
}
