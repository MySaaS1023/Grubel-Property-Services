import { NextResponse } from "next/server";
import { validateContactMessage } from "@/lib/contact-validation";
import { queueOperationalEmail } from "@/lib/email";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { prepareUploadRecord } from "@/lib/uploads";

const acceptedContactFileTypes = new Set([
  "image/jpeg",
  "image/png",
  "application/pdf",
]);
const acceptedContactFileExtensions = new Set(["jpg", "jpeg", "png", "pdf"]);
const maxContactFileSize = 25 * 1024 * 1024;

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

  const fields = Object.fromEntries(
    Array.from(formData.entries()).filter(([, value]) => typeof value === "string"),
  );
  const validation = validateContactMessage(fields);

  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error, fieldErrors: validation.fieldErrors },
      { status: 400 },
    );
  }

  const { fullName, email, phone, subject, message } = validation.data;

  const files = formData
    .getAll("photos")
    .filter((value): value is File => value instanceof File && value.size > 0);

  for (const file of files) {
    const fileValidation = validateContactFile(file);
    if (!fileValidation.success) {
      return NextResponse.json(
        {
          error: fileValidation.error,
          fieldErrors: { photos: fileValidation.error },
        },
        { status: 400 },
      );
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

function validateContactFile(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (
    !acceptedContactFileTypes.has(file.type) &&
    !acceptedContactFileExtensions.has(extension)
  ) {
    return {
      success: false as const,
      error: "Uploads must be JPG, JPEG, PNG, or PDF files.",
    };
  }

  if (file.size > maxContactFileSize) {
    return {
      success: false as const,
      error: "Each uploaded file must be 25MB or smaller.",
    };
  }

  return { success: true as const };
}
