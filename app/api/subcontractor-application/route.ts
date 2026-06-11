import { NextResponse } from "next/server";
import { queueOperationalEmail } from "@/lib/email";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import {
  prepareUploadRecord,
  uploadFileToSupabaseStorage,
  validateUploadFile,
} from "@/lib/uploads";

const applicationTypes = new Set(["handyman", "residential", "commercial"]);

const requiredCoreFields = ["fullName", "phone", "email"] as const;

export async function POST(request: Request) {
  const formData = await request.formData();
  const applicationType = normalizeApplicationType(formData.get("applicationType"));

  if (!applicationType || !applicationTypes.has(applicationType)) {
    return NextResponse.json(
      { error: "Valid application type is required." },
      { status: 400 },
    );
  }

  for (const field of requiredCoreFields) {
    const value = formData.get(field);
    if (!value || typeof value !== "string" || !value.trim()) {
      return NextResponse.json(
        { error: `${field} is required.` },
        { status: 400 },
      );
    }
  }

  const fileEntries: Array<[string, File]> = [];

  for (const [key, value] of formData.entries()) {
    if (value instanceof File && value.size > 0) {
      fileEntries.push([key, value]);
    }
  }

  for (const [, file] of fileEntries) {
    const fileValidation = validateUploadFile(file);
    if (!fileValidation.success) {
      return NextResponse.json({ error: fileValidation.error }, { status: 400 });
    }
  }

  const fullName = String(formData.get("fullName"));
  const fallbackRelatedId = `${applicationType}-${String(formData.get("email"))}`;
  let applicationId = fallbackRelatedId;
  let supabaseConfigured = false;
  let uploadedFiles = fileEntries.map(([fieldName, file]) =>
    prepareUploadRecord({
      category: mapUploadCategory(fieldName),
      file,
      relatedId: fallbackRelatedId,
      relatedType: "subcontractor_application",
      uploadedBy: fullName,
    }),
  );

  const submission = Object.fromEntries(
    Array.from(formData.entries()).map(([key, value]) => [
      key,
      value instanceof File
        ? { fileName: value.name, size: value.size, type: value.type }
        : value,
    ]),
  );

  const payload = {
    applicationType,
    applicant: {
      fullName,
      companyName: formData.get("companyName") ?? formData.get("businessName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
    },
    experience:
      formData.get("experience") ??
      formData.get("yearsExperience") ??
      formData.get("residentialExperience") ??
      formData.get("commercialExperience"),
    servicesOffered:
      formData.get("servicesOffered") ??
      formData.get("tradesOffered") ??
      formData.get("handymanSkills") ??
      formData.get("tradeSkill"),
    serviceAreas:
      formData.get("serviceAreas") ??
      formData.get("coverageAreas") ??
      formData.get("serviceTerritories"),
    crewSize: formData.get("crewSize"),
    licensingInsuranceInfo:
      formData.get("licensedInsured") ?? formData.get("licensingInsuranceInfo"),
    notes: formData.get("notes") ?? formData.get("additionalNotes"),
    uploadedFiles,
    rawSubmission: submission,
  };

  const supabase = createServiceSupabaseClient();

  if (supabase) {
    supabaseConfigured = true;

    const { data: application, error: applicationError } = await supabase
      .from("subcontractor_applications")
      .insert({
        application_type: applicationType,
        applicant_name: fullName,
        company_name: payload.applicant.companyName || null,
        email: payload.applicant.email,
        phone: payload.applicant.phone,
        experience: payload.experience || null,
        services_offered: payload.servicesOffered || null,
        service_areas: payload.serviceAreas || null,
        crew_size: payload.crewSize || null,
        licensing_insurance_info: payload.licensingInsuranceInfo || null,
        notes: payload.notes || null,
        raw_submission: submission,
        status: "New",
      })
      .select("id")
      .single();

    if (applicationError) {
      return NextResponse.json(
        {
          error: `Unable to save subcontractor application: ${applicationError.message}`,
        },
        { status: 500 },
      );
    }

    applicationId = application.id;
    uploadedFiles = await Promise.all(
      fileEntries.map(async ([fieldName, file]) => {
        const prepared = prepareUploadRecord({
          category: mapUploadCategory(fieldName),
          file,
          relatedId: applicationId,
          relatedType: "subcontractor_application",
          uploadedBy: fullName,
        });

        return uploadFileToSupabaseStorage({ file, record: prepared });
      }),
    );

    if (uploadedFiles.length) {
      const { error: uploadError } = await supabase.from("uploads").insert(
        uploadedFiles.map((file) => ({
          related_id: applicationId,
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

    await supabase.from("crm_logs").insert({
      type: "Subcontractor Action",
      actor: fullName,
      related_quote_or_project: applicationId,
      status: "New",
      notes: `New ${applicationType} subcontractor application received.`,
    });
  } else {
    console.info("Supabase not configured. Subcontractor application logged only.", {
      ...payload,
      devMessage:
        "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to persist applications.",
    });
  }

  await queueOperationalEmail({
    type: "subcontractor_application_received",
    subject: "New subcontractor application received",
    data: payload,
  });

  return NextResponse.json({
    success: true,
    message: "Subcontractor application received.",
    applicationId,
    supabaseConfigured,
    uploadedFiles: uploadedFiles.map((file) => ({
      fileName: file.fileName,
      fileType: file.fileType,
      size: file.size,
      category: file.category,
    })),
  });
}

function normalizeApplicationType(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toLowerCase().replace(/\s+/g, "-") === "handy-man"
    ? "handyman"
    : value.trim().toLowerCase();
}

function mapUploadCategory(fieldName: string) {
  const normalized = fieldName.toLowerCase();

  if (normalized.includes("insurance")) {
    return "insurance_document" as const;
  }

  if (normalized.includes("license") || normalized.includes("certification")) {
    return "license" as const;
  }

  if (normalized.includes("portfolio") || normalized.includes("photo")) {
    return "portfolio_photo" as const;
  }

  if (normalized.includes("id") || normalized.includes("identification")) {
    return "identification" as const;
  }

  return "subcontractor_upload" as const;
}
