import { NextResponse } from "next/server";
import { queueOperationalEmail } from "@/lib/email";
import { prepareUploadRecord, validateUploadFile } from "@/lib/uploads";

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
  const relatedId = `${applicationType}-${String(formData.get("email"))}`;
  const uploadedFiles = fileEntries.map(([fieldName, file]) =>
    prepareUploadRecord({
      category: mapUploadCategory(fieldName),
      file,
      relatedId,
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

  // Future Supabase insert point: store subcontractor application, upload
  // metadata, document status, and CRM log in one operation.
  console.info("New subcontractor application", payload);

  await queueOperationalEmail({
    type: "subcontractor_application_received",
    subject: "New subcontractor application received",
    data: payload,
  });

  return NextResponse.json({
    success: true,
    message: "Subcontractor application received.",
    uploadedFiles,
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
