import { Resend } from "resend";

type EmailType =
  | "new_service_request"
  | "quote_issued"
  | "payment_received"
  | "appointment_scheduled"
  | "project_scheduled"
  | "subcontractor_application_received"
  | "job_assignment_notification";

type EmailPayload = {
  type: EmailType;
  to?: string;
  subject: string;
  data: Record<string, unknown>;
};

export async function queueOperationalEmail(payload: EmailPayload) {
  const businessEmail = process.env.BUSINESS_EMAIL ?? "info@grubelps.com";
  const resendApiKey = process.env.RESEND_API_KEY;
  const to = payload.to ?? businessEmail;

  if (resendApiKey) {
    const resend = new Resend(resendApiKey);

    await resend.emails.send({
      from: `Grubel Property Services <${businessEmail}>`,
      to,
      subject: payload.subject,
      text: formatEmailText(payload),
    });

    return { queued: true, sent: true };
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
