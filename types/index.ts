export type QuoteStatus =
  | "Quote Sent"
  | "Awaiting Payment"
  | "Deposit Paid"
  | "Scheduled"
  | "In Progress"
  | "Completed"
  | "Canceled";

export type PaymentStatus = "Unpaid" | "Deposit Paid" | "Paid";

export type ProjectStatus =
  | "Quote Sent"
  | "Awaiting Payment"
  | "Deposit Paid"
  | "Scheduled"
  | "In Progress"
  | "Completed"
  | "Canceled";

export type SubcontractorStatus =
  | "Pending Approval"
  | "Active"
  | "Suspended"
  | "Inactive";

export type JobAssignmentStatus =
  | "Assigned"
  | "Accepted"
  | "In Progress"
  | "Needs Review"
  | "Completed";

export type UploadCategory =
  | "customer_project_photo"
  | "subcontractor_upload"
  | "identification"
  | "insurance_document"
  | "license"
  | "completion_photo";

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  billingAddress?: string;
  createdAt: string;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  serviceType: string;
  propertyAddress: string;
  amount: number;
  displayAmount: string;
  quoteStatus: QuoteStatus;
  paymentStatus: PaymentStatus;
  projectId: string;
  notes: string;
  createdAt: string;
  expiresAt?: string;
}

export interface Project {
  id: string;
  quoteNumber: string;
  customerId: string;
  serviceType: string;
  propertyAddress: string;
  status: ProjectStatus;
  scheduledDate: string;
  assignedTeam: string;
  nextStep: string;
  notes: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  quoteNumber: string;
  customerId: string;
  amount: number;
  displayAmount: string;
  status: PaymentStatus;
  method: string;
  paidAt?: string;
  stripeSessionId?: string;
}

export interface Subcontractor {
  id: string;
  fullName: string;
  businessName?: string;
  phone: string;
  email: string;
  tradeSkills: string[];
  status: SubcontractorStatus;
  serviceAreas: string[];
  availability: string;
  requiredDocuments: string[];
  createdAt: string;
}

export interface Application {
  id: string;
  applicationType: "handyman" | "residential" | "commercial" | "general";
  applicantName: string;
  email: string;
  phone: string;
  status: "New" | "Under Review" | "Approved" | "Denied";
  submittedAt: string;
}

export interface JobAssignment {
  id: string;
  projectId: string;
  subcontractorId: string;
  title: string;
  propertyAddress: string;
  status: JobAssignmentStatus;
  dueDate: string;
  notes: string;
}

export interface Message {
  id: string;
  projectId: string;
  senderType: "customer" | "admin" | "subcontractor";
  senderName: string;
  body: string;
  createdAt: string;
}

export interface Upload {
  id: string;
  relatedId: string;
  category: UploadCategory;
  fileName: string;
  fileType: string;
  size: number;
  uploadedBy: string;
  createdAt: string;
  storagePath?: string;
}
