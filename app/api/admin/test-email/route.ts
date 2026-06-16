import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth";
import { queueOperationalEmail } from "@/lib/email";

export async function POST(request: Request) {
  const profile = await getCurrentProfile("admin");

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const recipientEmail = typeof body?.email === "string" ? body.email.trim() : "";

  if (!isEmail(recipientEmail)) {
    return NextResponse.json(
      { error: "A valid recipient email is required." },
      { status: 400 },
    );
  }

  const result = await queueOperationalEmail({
    type: "internal_project_update",
    to: recipientEmail,
    subject: "Test Email - Grubel Property Services",
    text: [
      "This is a test email from the Grubel Property Services operations system.",
      "",
      "If you received this message, the email provider accepted this recipient and sender configuration.",
    ].join("\n"),
    data: {
      testEmail: true,
      requestedBy: profile.email,
      requestedAt: new Date().toISOString(),
    },
  });

  return NextResponse.json({
    success: result.sent,
    provider: result.provider,
    providerStatus: result.providerStatus,
    providerResponseId: result.id,
    recipientEmail: result.recipientEmail,
    fromEmail: result.fromEmail,
    resendApiKeyConfigured: Boolean(process.env.RESEND_API_KEY),
    fromEmailUsesResendSandbox: result.fromEmail.includes("onboarding@resend.dev"),
    warning: result.sent ? undefined : "email_not_sent",
    error: result.errorMessage,
  });
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
