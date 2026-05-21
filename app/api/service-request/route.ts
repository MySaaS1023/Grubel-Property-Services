import { NextResponse } from "next/server";
import { queueOperationalEmail } from "@/lib/email";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import {
  prepareUploadRecord,
  uploadFileToSupabaseStorage,
  validateUploadFile,
} from "@/lib/uploads";
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

  const supabase = createServiceSupabaseClient();
  const fallbackRelatedId = validation.data.email;
  let serviceRequestId = fallbackRelatedId;
  let supabaseConfigured = false;
  let uploadedFiles = files.map((file) =>
    prepareUploadRecord({
      category: "customer_project_photo",
      file,
      relatedId: fallbackRelatedId,
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

  if (supabase) {
    supabaseConfigured = true;

    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .upsert(
        {
          full_name: validation.data.fullName,
          email: validation.data.email,
          phone: validation.data.phone,
          property_address: validation.data.propertyAddress || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "email" },
      )
      .select("id")
      .single();

    if (customerError) {
      return NextResponse.json(
        { error: `Unable to save customer: ${customerError.message}` },
        { status: 500 },
      );
    }

    const { data: serviceRequest, error: requestError } = await supabase
      .from("service_requests")
      .insert({
        customer_id: customer.id,
        customer_name: validation.data.fullName,
        customer_email: validation.data.email,
        customer_phone: validation.data.phone,
        service_type: validation.data.serviceNeeded || "Other",
        property_address: validation.data.propertyAddress || null,
        property_type: validation.data.propertyType || null,
        occupancy_status: validation.data.occupancyStatus || null,
        preferred_date: validation.data.preferredDate || null,
        preferred_time_window: validation.data.preferredTimeWindow || null,
        preferred_contact_method: validation.data.preferredContactMethod || null,
        project_description:
          validation.data.projectDescription || validation.data.message,
        additional_notes: validation.data.additionalNotes || null,
        status: "New",
      })
      .select("id")
      .single();

    if (requestError) {
      return NextResponse.json(
        { error: `Unable to save service request: ${requestError.message}` },
        { status: 500 },
      );
    }

    serviceRequestId = serviceRequest.id;
    uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const prepared = prepareUploadRecord({
          category: "customer_project_photo",
          file,
          relatedId: serviceRequestId,
          relatedType: "service_request",
          uploadedBy: validation.data.fullName,
        });

        return uploadFileToSupabaseStorage({ file, record: prepared });
      }),
    );

    if (uploadedFiles.length) {
      const { error: uploadError } = await supabase.from("uploads").insert(
        uploadedFiles.map((file) => ({
          related_id: serviceRequestId,
          related_type: file.relatedType,
          category: file.category,
          file_name: file.fileName,
          file_type: file.fileType,
          size: file.size,
          uploaded_by: file.uploadedBy,
          storage_bucket: file.storageBucket ?? null,
          storage_path: file.storagePath,
        })),
      );

      if (uploadError) {
        return NextResponse.json(
          { error: `Unable to save upload metadata: ${uploadError.message}` },
          { status: 500 },
        );
      }
    }

    if (validation.data.preferredDate) {
      await supabase.from("appointments").insert({
        customer_id: customer.id,
        service_request_id: serviceRequestId,
        customer_name: validation.data.fullName,
        service_type: validation.data.serviceNeeded || "Other",
        appointment_date: validation.data.preferredDate,
        time_window: validation.data.preferredTimeWindow || "Flexible",
        contact_method: validation.data.preferredContactMethod || "Phone",
        status: "Requested",
        notes: "Created from request service intake.",
      });
    }

    await supabase.from("crm_logs").insert({
      type: "Service Request",
      actor: validation.data.fullName,
      related_quote_or_project: serviceRequestId,
      status: "New",
      notes: `New ${validation.data.serviceNeeded || "service"} request received.`,
    });
  } else {
    console.info("Supabase not configured. Service request logged only.", {
      ...serviceRequestPayload,
      devMessage:
        "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to persist submissions.",
    });
  }

  await queueOperationalEmail({
    type: "new_service_request",
    subject: "New service request received",
    data: serviceRequestPayload,
  });

  return NextResponse.json({
    success: true,
    message: "Service request received.",
    serviceRequestId,
    supabaseConfigured,
    uploadedFiles,
  });
}
