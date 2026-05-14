import type { UploadCategory } from "@/types";

export type UploadMetadata = {
  id?: string;
  relatedId: string;
  relatedType:
    | "service_request"
    | "project"
    | "quote"
    | "subcontractor"
    | "subcontractor_application"
    | "job_assignment";
  category: UploadCategory;
  fileName: string;
  fileType: string;
  size: number;
  uploadedBy?: string;
  storagePath?: string;
};
