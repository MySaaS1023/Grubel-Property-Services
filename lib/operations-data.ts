import type {
  Application,
  Customer,
  JobAssignment,
  Message,
  Payment,
  Project,
  Quote,
  Subcontractor,
  Upload,
} from "@/types";

export const customers: Customer[] = [
  {
    id: "cust_1001",
    fullName: "Test Customer",
    email: "test@example.com",
    phone: "555-555-1001",
    billingAddress: "123 Main St, Phoenix, AZ",
    createdAt: "2026-05-01",
  },
  {
    id: "cust_1002",
    fullName: "Test Deposit Customer",
    email: "deposit@example.com",
    phone: "555-555-1002",
    billingAddress: "456 Oak Ave, Mesa, AZ",
    createdAt: "2026-05-02",
  },
  {
    id: "cust_1003",
    fullName: "Test Paid Customer",
    email: "paid@example.com",
    phone: "555-555-1003",
    billingAddress: "789 Desert View Rd, Scottsdale, AZ",
    createdAt: "2026-05-03",
  },
];

export const quotes: Quote[] = [
  {
    id: "quote_1001",
    quoteNumber: "GPS-1001",
    customerId: "cust_1001",
    customerName: "Test Customer",
    serviceType: "Virtual Inspection",
    propertyAddress: "123 Main St, Phoenix, AZ",
    amount: 7500,
    displayAmount: "$75.00",
    quoteStatus: "Awaiting Payment",
    paymentStatus: "Unpaid",
    projectId: "proj_1001",
    notes: "Please complete your deposit to confirm scheduling.",
    createdAt: "2026-05-05",
    expiresAt: "2026-06-05",
  },
  {
    id: "quote_1002",
    quoteNumber: "GPS-1002",
    customerId: "cust_1002",
    customerName: "Test Deposit Customer",
    serviceType: "Repair",
    propertyAddress: "456 Oak Ave, Mesa, AZ",
    amount: 10000,
    displayAmount: "$100.00",
    quoteStatus: "Scheduled",
    paymentStatus: "Deposit Paid",
    projectId: "proj_1002",
    notes: "Deposit received. Your repair service has been scheduled.",
    createdAt: "2026-05-06",
  },
  {
    id: "quote_1003",
    quoteNumber: "GPS-1003",
    customerId: "cust_1003",
    customerName: "Test Paid Customer",
    serviceType: "Turnover Prep",
    propertyAddress: "789 Desert View Rd, Scottsdale, AZ",
    amount: 15000,
    displayAmount: "$150.00",
    quoteStatus: "Completed",
    paymentStatus: "Paid",
    projectId: "proj_1003",
    notes: "Payment received. Turnover prep has been completed.",
    createdAt: "2026-05-07",
  },
];

export const projects: Project[] = [
  {
    id: "proj_1001",
    quoteNumber: "GPS-1001",
    customerId: "cust_1001",
    serviceType: "Virtual Inspection",
    propertyAddress: "123 Main St, Phoenix, AZ",
    status: "Awaiting Payment",
    scheduledDate: "Pending payment",
    assignedTeam: "Scheduling pending",
    nextStep: "Complete your deposit to confirm scheduling.",
    notes: "Customer uploaded exterior and kitchen photos for review.",
    updatedAt: "2026-05-10",
  },
  {
    id: "proj_1002",
    quoteNumber: "GPS-1002",
    customerId: "cust_1002",
    serviceType: "Repair",
    propertyAddress: "456 Oak Ave, Mesa, AZ",
    status: "Scheduled",
    scheduledDate: "May 22, 2026",
    assignedTeam: "Repair Coordination Team",
    nextStep: "Arrival details will be confirmed before the scheduled visit.",
    notes: "Door adjustment and drywall patch punch list.",
    updatedAt: "2026-05-11",
  },
  {
    id: "proj_1003",
    quoteNumber: "GPS-1003",
    customerId: "cust_1003",
    serviceType: "Turnover Prep",
    propertyAddress: "789 Desert View Rd, Scottsdale, AZ",
    status: "Completed",
    scheduledDate: "May 24, 2026",
    assignedTeam: "Turnover Prep Team",
    nextStep: "Service is complete. Contact Grubel Property Services with any follow-up questions.",
    notes: "Paint touch-up and fixture replacement coordination completed.",
    updatedAt: "2026-05-12",
  },
];

export const payments: Payment[] = [
  {
    id: "pay_1001",
    quoteNumber: "GPS-1001",
    customerId: "cust_1001",
    amount: 7500,
    displayAmount: "$75.00",
    status: "Unpaid",
    method: "Stripe Checkout",
  },
  {
    id: "pay_1002",
    quoteNumber: "GPS-1002",
    customerId: "cust_1002",
    amount: 10000,
    displayAmount: "$100.00",
    status: "Deposit Paid",
    method: "Stripe Checkout",
    paidAt: "2026-05-09",
  },
  {
    id: "pay_1003",
    quoteNumber: "GPS-1003",
    customerId: "cust_1003",
    amount: 15000,
    displayAmount: "$150.00",
    status: "Paid",
    method: "Stripe Checkout",
    paidAt: "2026-05-10",
  },
];

export const uploads: Upload[] = [
  {
    id: "upload_1001",
    relatedId: "proj_1001",
    category: "customer_project_photo",
    fileName: "front-entry.jpg",
    fileType: "image/jpeg",
    size: 245000,
    uploadedBy: "Test Customer",
    createdAt: "2026-05-10",
  },
  {
    id: "upload_1002",
    relatedId: "proj_1003",
    category: "completion_photo",
    fileName: "turnover-progress.png",
    fileType: "image/png",
    size: 310000,
    uploadedBy: "Turnover Prep Team",
    createdAt: "2026-05-12",
  },
];

export const messages: Message[] = [
  {
    id: "msg_1001",
    projectId: "proj_1002",
    senderType: "admin",
    senderName: "Grubel Property Services",
    body: "Repair visit is scheduled. Please confirm gate access if needed.",
    createdAt: "2026-05-11",
  },
  {
    id: "msg_1002",
    projectId: "proj_1003",
    senderType: "admin",
    senderName: "Grubel Property Services",
    body: "Turnover prep has started and completion photos will be added after final walkthrough.",
    createdAt: "2026-05-12",
  },
];

export const applications: Application[] = [
  {
    id: "app_1001",
    applicationType: "handyman",
    applicantName: "Handyman Applicant",
    email: "handy@example.com",
    phone: "555-555-2001",
    status: "New",
    submittedAt: "2026-05-12",
  },
  {
    id: "app_1002",
    applicationType: "commercial",
    applicantName: "Commercial Crew LLC",
    email: "commercial@example.com",
    phone: "555-555-2002",
    status: "Under Review",
    submittedAt: "2026-05-11",
  },
];

export const subcontractors: Subcontractor[] = [
  {
    id: "sub_1001",
    fullName: "Approved Repair Partner",
    businessName: "Repair Partner LLC",
    phone: "555-555-3001",
    email: "partner@example.com",
    tradeSkills: ["Drywall", "Paint", "Turnover repairs"],
    status: "Active",
    serviceAreas: ["Phoenix", "Mesa", "Tempe"],
    availability: "Weekdays",
    requiredDocuments: ["ID on file", "Insurance pending renewal"],
    createdAt: "2026-05-01",
  },
];

export const jobAssignments: JobAssignment[] = [
  {
    id: "job_1001",
    projectId: "proj_1002",
    subcontractorId: "sub_1001",
    title: "Door adjustment and drywall patch",
    propertyAddress: "456 Oak Ave, Mesa, AZ",
    status: "Assigned",
    dueDate: "May 22, 2026",
    notes: "Confirm arrival window and upload completion photos.",
  },
  {
    id: "job_1002",
    projectId: "proj_1003",
    subcontractorId: "sub_1001",
    title: "Turnover repair punch list",
    propertyAddress: "789 Desert View Rd, Scottsdale, AZ",
    status: "In Progress",
    dueDate: "May 24, 2026",
    notes: "Upload progress notes before final walkthrough.",
  },
];

export function getPortalRecord(quoteNumber: string) {
  const normalized = quoteNumber.trim().toUpperCase();
  const quote = quotes.find((item) => item.quoteNumber === normalized);

  if (!quote) {
    return null;
  }

  const project = projects.find((item) => item.id === quote.projectId);
  const payment = payments.find((item) => item.quoteNumber === quote.quoteNumber);
  const projectUploads = uploads.filter((item) => item.relatedId === quote.projectId);
  const projectMessages = messages.filter((item) => item.projectId === quote.projectId);

  return {
    quote,
    project,
    payment,
    uploads: projectUploads,
    messages: projectMessages,
  };
}
