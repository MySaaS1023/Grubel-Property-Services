import type { UploadCategory } from "@/types";

export type PreparedUpload = {
  category: UploadCategory;
  fileName: string;
  fileType: string;
  size: number;
  storagePath: string;
};

export function prepareUploadRecord({
  category,
  file,
  relatedId,
}: {
  category: UploadCategory;
  file: File;
  relatedId: string;
}): PreparedUpload {
  // Future cloud storage integration point: upload to Supabase Storage or
  // another private object store and replace this path with the stored object key.
  return {
    category,
    fileName: file.name,
    fileType: file.type,
    size: file.size,
    storagePath: `${category}/${relatedId}/${file.name}`,
  };
}
