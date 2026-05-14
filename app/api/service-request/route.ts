import { NextResponse } from "next/server";
import { queueOperationalEmail } from "@/lib/email";
import { prepareUploadRecord, validateUploadFile } from "@/lib/uploads";
import { validateServiceRequest } from "@/lib/validation";

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
    const fileValidation = validateUploadFile(file);
    if (!fileValidation.success) {
      return NextResponse.json({ error: fileValidation.error }, { status: 400 });
    }
  }

  const uploadedFiles = files.map((file) =>
    prepareUploadRecord({
      category: "customer_project_photo",
      file,
      relatedId: validation.data.email,
      relatedType: "service_request",
      uploadedBy: validation.data.fullName,
    }),
  );

  const serviceRequestPayload = {
    customer: {
      fullName: validation.data.fullName,
      email: validation.data.email,
      phone: validation.data.phone,
    },
    service: {
      serviceType: validation.data.serviceNeeded,
      propertyAddress: validation.data.propertyAddress,
      propertyType: validation.data.propertyType,
      occupancyStatus: validation.data.occupancyStatus,
      preferredDate: validation.data.preferredDate,
      preferredTimeWindow: validation.data.preferredTimeWindow,
      preferredContactMethod: validation.data.preferredContactMethod,
    },
    projectDescription: validation.data.projectDescription || validation.data.message,
    additionalNotes: validation.data.additionalNotes,
    uploadedFiles,
  };

  // Future Supabase insert point: create customer, service_request,
  // appointment placeholder, upload metadata rows, and CRM log entry here.
  // Future cloud storage point: upload files to private object storage and save
  // the resulting file URLs with the service request record.
  console.info("New Grubel Property Services request", serviceRequestPayload);

  await queueOperationalEmail({
    type: "new_service_request",
    subject: "New service request received",
    data: serviceRequestPayload,
  });

  return NextResponse.json({
    success: true,
    message: "Service request received.",
    uploadedFiles,
  });
}
