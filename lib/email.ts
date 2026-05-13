type EmailType =
  | "new_service_request"
  | "quote_issued"
  | "payment_received"
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

  // Future Resend integration point: send transactional emails here once
  // RESEND_API_KEY is configured. Keep secrets in environment variables only.
  console.info("Operational email prepared", {
    ...payload,
    to: payload.to ?? businessEmail,
    configured: Boolean(resendApiKey),
  });

  return { queued: true };
}
