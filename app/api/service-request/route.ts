import { NextResponse } from "next/server";
import { validateServiceRequest } from "@/lib/validation";

const allowedFileTypes = new Set([
  "image/jpeg",
  "image/png",
  "application/pdf",
]);
const maxFileSize = 8 * 1024 * 1024;

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Service requests must be submitted as form data." },
      { status: 400 },
    );
  }

  const formData = await request.formData();
  const fields = Object.fromEntries(
    Array.from(formData.entries()).filter(([, value]) => typeof value === "string"),
  );

  const validation = validateServiceRequest(fields);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const files = formData
    .getAll("photos")
    .filter((value): value is File => value instanceof File && value.size > 0);

  for (const file of files) {
    if (!allowedFileTypes.has(file.type)) {
      return NextResponse.json(
        { error: "Uploads must be JPG, PNG, JPEG, or PDF files." },
        { status: 400 },
      );
    }

    if (file.size > maxFileSize) {
      return NextResponse.json(
        { error: "Each uploaded file must be 8MB or smaller." },
        { status: 400 },
      );
    }
  }

  const uploadedFiles = files.map((file) => ({
    fileName: file.name,
    size: file.size,
    type: file.type,
  }));

  // Email delivery can be added here later with Resend or Nodemailer.
  // Future cloud storage point: upload files to private object storage and save
  // the resulting file URLs with the service request record.
  console.info("New Grubel Property Services request", {
    ...validation.data,
    uploadedFiles,
  });

  return NextResponse.json({
    success: true,
    message: "Service request received.",
    uploadedFiles,
  });
}
