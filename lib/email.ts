import { Resend } from "resend";

type EmailType =
  | "new_service_request"
  | "quote_issued"
  | "payment_received"
  | "appointment_scheduled"
  | "project_scheduled"
  | "subcontractor_application_received"
  | "job_assignment_notification"
  | "contact_message";

type EmailPayload = {
  type: EmailType;
  to?: string;
  from?: string;
  subject: string;
  text?: string;
  data: Record<string, unknown>;
};

export async function queueOperationalEmail(payload: EmailPayload) {
  const businessEmail = process.env.BUSINESS_EMAIL ?? "info@grubelps.com";
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    payload.from ??
    process.env.FROM_EMAIL ??
    "Grubel Property Services <onboarding@resend.dev>";
  const to = payload.to ?? businessEmail;

  console.info("Resend email configuration", {
    resendApiKeyExists: Boolean(resendApiKey),
    businessEmail,
    fromEmail,
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
      console.error("Resend email failed", result.error);
      return { queued: true, sent: false, error: result.error };
    }

    console.info("Resend email sent", { id: result.data?.id });
    return { queued: true, sent: true, id: result.data?.id };
  }

  console.info("email skipped: RESEND_API_KEY is not configured", {
    type: payload.type,
    to,
    subject: payload.subject,
    configured: false,
    data: payload.data,
  });

  return { queued: true, sent: false };
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
