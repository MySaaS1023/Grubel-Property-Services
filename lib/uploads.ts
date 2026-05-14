import type { UploadCategory } from "@/types";
import type { UploadMetadata } from "@/types/uploads";

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

  // Future Supabase Storage integration point:
  // upload the file to a private bucket, then persist this metadata in uploads.
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
