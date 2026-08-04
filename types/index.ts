export type ServiceType =
  | "Maintenance & Repair"
  | "Property Preservation"
  | "Builds & Remodels"
  | "General Property Questions"
  | "Other";

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
  | "New Request"
  | "Quote Sent"
  | "Awaiting Payment"
  | "Deposit Paid"
  | "Scheduled"
  | "In Progress"
  | "Completed"
  | "Canceled";

export type AppointmentStatus =
  | "Requested"
  | "Scheduled"
  | "Completed"
  | "Canceled";

export type ContactMethod = "Phone" | "Video Call";

export type SubcontractorStatus =
  | "Pending Review"
  | "Approved"
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
  | "customer_document"
  | "subcontractor_upload"
  | "identification"
  | "insurance_document"
  | "license"
  | "portfolio_photo"
  | "completion_photo";

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  billingAddress?: string;
  propertyAddress?: string;
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: ServiceType;
  propertyAddress: string;
  propertyType: string;
  occupancyStatus: string;
  preferredDate?: string;
  projectDescription: string;
  additionalNotes?: string;
  status: "New" | "Reviewing" | "Quote Needed" | "Converted" | "Closed";
  uploadedFileIds: string[];
  createdAt: string;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: ServiceType;
  propertyAddress: string;
  amount: number;
  depositAmount: number;
  amountPaid: number;
  balanceDue: number;
  displayAmount: string;
  displayDepositAmount: string;
  displayAmountPaid: string;
  displayBalanceDue: string;
  quoteStatus: QuoteStatus;
  paymentStatus: PaymentStatus;
  serviceStatus: ProjectStatus;
  projectId: string;
  notes: string;
  scheduledDate: string;
  assignedTeam: string;
  createdAt: string;
  expiresAt?: string;
}

export interface Project {
  id: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  serviceType: ServiceType;
  propertyAddress: string;
  status: ProjectStatus;
  paymentStatus: PaymentStatus;
  scheduledDate: string;
  assignedTeam: string;
  nextStep: string;
  notes: string;
  uploadedFileIds: string[];
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

export interface Appointment {
  id: string;
  customerName: string;
  serviceType: ServiceType;
  appointmentDate: string;
  timeWindow:
    | "8:00 AM"
    | "9:00 AM"
    | "10:00 AM"
    | "11:00 AM"
    | "12:00 PM"
    | "1:00 PM"
    | "2:00 PM"
    | "3:00 PM"
    | "4:00 PM"
    | "5:00 PM";
  contactMethod: ContactMethod;
  status: AppointmentStatus;
  notes: string;
  quoteNumber?: string;
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
  missingDocuments: string[];
  createdAt: string;
}

export interface SubcontractorApplication {
  id: string;
  applicationType: "handyman" | "residential" | "commercial" | "general";
  applicantName: string;
  companyName?: string;
  email: string;
  phone: string;
  experience: string;
  servicesOffered: string;
  serviceAreas: string;
  crewSize?: string;
  licensingInsuranceInfo?: string;
  status: "New" | "Pending Review" | "Approved" | "Denied";
  uploadedFileIds: string[];
  submittedAt: string;
}

export interface JobAssignment {
  id: string;
  projectId: string;
  quoteNumber: string;
  subcontractorId: string;
  subcontractorName: string;
  title: string;
  propertyAddress: string;
  status: JobAssignmentStatus;
  dueDate: string;
  notes: string;
  uploadedFileIds: string[];
}

export interface CRMLog {
  id: string;
  date: string;
  type:
    | "Service Request"
    | "Consultation"
    | "Appointment"
    | "Quote Activity"
    | "Project Update"
    | "Customer Communication"
    | "Payment Update"
    | "Uploaded File"
    | "Subcontractor Action";
  actor: string;
  relatedQuoteOrProject: string;
  status: string;
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
  uploadedBy: string;
  createdAt: string;
  storagePath?: string;
}
