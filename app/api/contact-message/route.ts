import { NextResponse } from "next/server";
import { queueOperationalEmail } from "@/lib/email";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { prepareUploadRecord, validateUploadFile } from "@/lib/uploads";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Contact messages must be submitted as form data." },
      { status: 400 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (error) {
    console.error("[contact-message] formData parse failed", error);
    return NextResponse.json(
      { error: "Unable to read the contact form. Please try again." },
      { status: 400 },
    );
  }

  const fullName = clean(formData.get("fullName"));
  const email = clean(formData.get("email"));
  const phone = clean(formData.get("phone"));
  const subject = clean(formData.get("subject"));
  const message = clean(formData.get("message"));

  if (!fullName) {
    return NextResponse.json({ error: "Full name is required." }, { status: 400 });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "A valid email is required." },
      { status: 400 },
    );
  }

  if (!phone) {
    return NextResponse.json({ error: "Phone is required." }, { status: 400 });
  }

  if (!subject) {
    return NextResponse.json({ error: "Subject is required." }, { status: 400 });
  }

  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const files = formData
    .getAll("photos")
    .filter((value): value is File => value instanceof File && value.size > 0);

  for (const file of files) {
    const fileValidation = validateUploadFile(file);
    if (!fileValidation.success) {
      return NextResponse.json({ error: fileValidation.error }, { status: 400 });
    }
  }

  const uploadedFiles = files.map((file) =>
    prepareUploadRecord({
      category: "customer_document",
      file,
      relatedId: email,
      relatedType: "service_request",
      uploadedBy: fullName,
    }),
  );

  const supabase = createServiceSupabaseClient();
  if (supabase) {
    try {
      await supabase.from("crm_logs").insert({
        type: "Customer Communication",
        actor: fullName,
        related_quote_or_project: email,
        status: "Contact Message",
        notes: `${subject}: ${message}`,
      });
    } catch (error) {
      console.error("[contact-message] CRM log insert failed", error);
    }
  } else {
    console.info("[contact-message] Supabase not configured. Message logged only.", {
      fullName,
      email,
      phone,
      subject,
      uploadedFileNames: uploadedFiles.map((file) => file.fileName),
    });
  }

  let emailSent = false;
  try {
    const emailResult = await queueOperationalEmail({
      type: "contact_message",
      to: process.env.BUSINESS_EMAIL ?? "info@grubelps.com",
      from:
        process.env.FROM_EMAIL ??
        "Grubel Property Services <onboarding@resend.dev>",
      subject: `New Contact Message - ${subject}`,
      text: formatContactEmail({
        fullName,
        email,
        phone,
        subject,
        message,
        uploadedFileNames: uploadedFiles.map((file) => file.fileName),
      }),
      data: {
        fullName,
        email,
        phone,
        subject,
        message,
        uploadedFiles,
      },
    });
    emailSent = emailResult.sent;
    console.log("[contact-message] email result", emailResult);
  } catch (error) {
    console.error("[contact-message] email failed", error);
  }

  return NextResponse.json({
    success: true,
    emailSent,
    uploadedFiles: uploadedFiles.map((file) => ({
      fileName: file.fileName,
      fileType: file.fileType,
      size: file.size,
    })),
  });
}

function clean(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function formatContactEmail({
  fullName,
  email,
  phone,
  subject,
  message,
  uploadedFileNames,
}: {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  uploadedFileNames: string[];
}) {
  return [
    "New Contact Message - Grubel Property Services",
    "",
    `Full Name: ${fullName}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Subject: ${subject}`,
    "",
    "Message:",
    message,
    "",
    "Uploaded Files:",
    uploadedFileNames.length ? uploadedFileNames.join(", ") : "None",
  ].join("\n");
}
