import type { UploadCategory } from "@/types";
import type { UploadMetadata } from "@/types/uploads";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export const allowedUploadTypes = new Set([
  "image/jpeg",
  "image/png",
  "application/pdf",
]);

export const maxUploadSize = 8 * 1024 * 1024;

export type PreparedUpload = UploadMetadata & {
  category: UploadCategory;
  fileName: string;
  fileType: string;
  size: number;
  storagePath: string;
  storageBucket?: string;
};

export function validateUploadFile(file: File) {
  if (!allowedUploadTypes.has(file.type)) {
    return {
      success: false as const,
      error: "Uploads must be JPG, PNG, JPEG, or PDF files.",
    };
  }

  if (file.size > maxUploadSize) {
    return {
      success: false as const,
      error: "Each uploaded file must be 8MB or smaller.",
    };
  }

  return { success: true as const };
}

export function prepareUploadRecord({
  category,
  file,
  relatedId,
  relatedType = "service_request",
  uploadedBy,
}: {
  category: UploadCategory;
  file: File;
  relatedId: string;
  relatedType?: UploadMetadata["relatedType"];
  uploadedBy?: string;
}): PreparedUpload {
  const safeFileName = file.name.replace(/[^\w.\- ]+/g, "").trim();

  return {
    category,
    relatedId,
    relatedType,
    fileName: safeFileName || "uploaded-file",
    fileType: file.type,
    size: file.size,
    uploadedBy,
    storagePath: `${category}/${relatedId}/${Date.now()}-${safeFileName || "uploaded-file"}`,
  };
}

export function getUploadBucket(relatedType: UploadMetadata["relatedType"]) {
  if (relatedType === "subcontractor_application" || relatedType === "subcontractor") {
    return "subcontractor-documents";
  }

  if (relatedType === "project" || relatedType === "job_assignment") {
    return "project-files";
  }

  return "service-uploads";
}

export async function uploadFileToSupabaseStorage({
  file,
  record,
}: {
  file: File;
  record: PreparedUpload;
}) {
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return {
      ...record,
      storageBucket: getUploadBucket(record.relatedType),
      storageConfigured: false,
    };
  }

  const storageBucket = getUploadBucket(record.relatedType);
  const arrayBuffer = await file.arrayBuffer();
  const { error } = await supabase.storage
    .from(storageBucket)
    .upload(record.storagePath, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(`Unable to upload ${record.fileName}: ${error.message}`);
  }

  return {
    ...record,
    storageBucket,
    storageConfigured: true,
  };
}
