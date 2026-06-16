import { queueOperationalEmail } from "@/lib/email";

type RequestEmailContext = {
  serviceRequestId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  serviceType?: string;
  propertyAddress?: string;
  propertyType?: string;
  occupancyStatus?: string;
  preferredDays?: string;
  preferredTimeWindow?: string;
  preferredContactMethod?: string;
  walkthroughOption?: string;
  projectDescription?: string;
  uploadedFileNames?: string[];
};

type ProjectEmailContext = {
  projectId?: string;
  customerName?: string;
  customerEmail?: string;
  serviceType?: string;
  propertyAddress?: string;
  assignedVendorName?: string;
  assignedVendorEmail?: string;
  scheduledDate?: string;
  status?: string;
};

function businessEmail() {
  return process.env.BUSINESS_EMAIL ?? "info@grubelps.com";
}

function value(text: string | undefined, fallback = "Not provided") {
  return text && text.trim() ? text : fallback;
}

function lines(parts: string[]) {
  return parts.join("\n");
}

export async function sendNewRequestCustomerConfirmationEmail(
  context: RequestEmailContext,
) {
  if (!context.customerEmail) {
    console.error("[workflow-email] New Request confirmation skipped: missing email");
    return { queued: false, sent: false, skipped: true };
  }

  return queueOperationalEmail({
    type: "new_service_request",
    to: context.customerEmail,
    subject: "Project Request Received - Grubel Property Services",
    text: lines([
      `Hi ${value(context.customerName, "there")},`,
      "",
      "Thank you. Grubel Property Services received your project request.",
      "",
      `Service Requested: ${value(context.serviceType)}`,
      `Property: ${value(context.propertyAddress)}`,
      "",
      "Our team will review the details and follow up with next steps.",
      "",
      "Grubel Property Services",
      "info@grubelps.com",
      "(480) 420-7398",
    ]),
    data: context,
  });
}

export async function sendNewRequestAdminNotificationEmail(
  context: RequestEmailContext,
) {
  return queueOperationalEmail({
    type: "new_service_request",
    to: businessEmail(),
    subject: "New Project Request - Grubel Property Services",
    text: lines([
      "A new project request was submitted.",
      "",
      `Full Name: ${value(context.customerName)}`,
      `Email: ${value(context.customerEmail)}`,
      `Phone: ${value(context.customerPhone)}`,
      `Service Needed: ${value(context.serviceType)}`,
      `Property Address: ${value(context.propertyAddress)}`,
      `Property Type: ${value(context.propertyType)}`,
      `Occupancy Status: ${value(context.occupancyStatus)}`,
      `Preferred Days: ${value(context.preferredDays)}`,
      `Preferred Time Range: ${value(context.preferredTimeWindow)}`,
      `Preferred Contact Method: ${value(context.preferredContactMethod)}`,
      `Walkthrough Option: ${value(context.walkthroughOption)}`,
      "",
      "Project Description:",
      value(context.projectDescription),
      "",
      "Uploaded Files:",
      context.uploadedFileNames?.length
        ? context.uploadedFileNames.join(", ")
        : "None",
    ]),
    data: context,
  });
}

export async function sendReviewingStatusEmail(context: RequestEmailContext) {
  if (!context.customerEmail) {
    console.error("[workflow-email] Reviewing email skipped: missing email");
    return { queued: false, sent: false, skipped: true };
  }

  return queueOperationalEmail({
    type: "customer_status_update",
    to: context.customerEmail,
    subject: "Your Request Is Being Reviewed - Grubel Property Services",
    text: lines([
      `Hi ${value(context.customerName, "there")},`,
      "",
      "Your project request is now being reviewed by Grubel Property Services.",
      "Our team is reviewing your property details, notes, and uploaded media to determine next steps.",
      "",
      `Service: ${value(context.serviceType)}`,
      `Property: ${value(context.propertyAddress)}`,
      "",
      "Grubel Property Services",
    ]),
    data: { ...context, status: "Reviewing" },
  });
}

export async function sendVendorPricingInternalEmail(
  context: ProjectEmailContext,
) {
  return queueOperationalEmail({
    type: "internal_project_update",
    to: businessEmail(),
    subject: "Project Entered Vendor Pricing - Grubel Property Services",
    text: lines([
      "A project is ready for vendor pricing.",
      "",
      `Customer: ${value(context.customerName)}`,
      `Service: ${value(context.serviceType)}`,
      `Property: ${value(context.propertyAddress)}`,
      `Project ID: ${value(context.projectId)}`,
    ]),
    data: { ...context, status: "Vendor Pricing" },
  });
}

export async function sendAwaitingCustomerApprovalEmail(
  context: ProjectEmailContext,
) {
  if (!context.customerEmail) {
    console.error(
      "[workflow-email] Awaiting Customer Approval email skipped: missing email",
    );
    return { queued: false, sent: false, skipped: true };
  }

  return queueOperationalEmail({
    type: "customer_status_update",
    to: context.customerEmail,
    subject: "Project Pricing Ready for Approval - Grubel Property Services",
    text: lines([
      `Hi ${value(context.customerName, "there")},`,
      "",
      "Your project pricing is ready for review. Please review the scope and cost details from Grubel Property Services.",
      "",
      `Service: ${value(context.serviceType)}`,
      `Property: ${value(context.propertyAddress)}`,
      "",
      "Grubel Property Services",
    ]),
    data: { ...context, status: "Awaiting Customer Approval" },
  });
}

export async function sendScheduledCustomerEmail(context: ProjectEmailContext) {
  if (!context.customerEmail) {
    console.error("[workflow-email] Scheduled email skipped: missing customer email");
    return { queued: false, sent: false, skipped: true };
  }

  return queueOperationalEmail({
    type: "project_scheduled",
    to: context.customerEmail,
    subject: "Your Project Has Been Scheduled - Grubel Property Services",
    text: lines([
      `Hi ${value(context.customerName, "there")},`,
      "",
      "Your project has been scheduled. Grubel Property Services will keep you updated as work begins.",
      "",
      `Service: ${value(context.serviceType)}`,
      `Property: ${value(context.propertyAddress)}`,
      `Scheduled Date: ${value(context.scheduledDate)}`,
      "",
      "Grubel Property Services",
    ]),
    data: { ...context, status: "Scheduled" },
  });
}

export async function sendScheduledVendorEmail(context: ProjectEmailContext) {
  const to = context.assignedVendorEmail || businessEmail();

  return queueOperationalEmail({
    type: "vendor_assignment_notification",
    to,
    subject: "Scheduled Project Assignment - Grubel Property Services",
    text: lines([
      context.assignedVendorEmail
        ? "A project has been scheduled and assigned."
        : "A project has been scheduled, but no vendor email was found. Please confirm assignment details.",
      "",
      `Assigned Vendor: ${value(context.assignedVendorName, "Not assigned")}`,
      `Customer: ${value(context.customerName)}`,
      `Service: ${value(context.serviceType)}`,
      `Property: ${value(context.propertyAddress)}`,
      `Scheduled Date: ${value(context.scheduledDate)}`,
      `Project ID: ${value(context.projectId)}`,
    ]),
    data: {
      ...context,
      status: "Scheduled",
      vendorEmailResolved: Boolean(context.assignedVendorEmail),
    },
  });
}

export async function sendInProgressCustomerEmail(context: ProjectEmailContext) {
  if (!context.customerEmail) {
    console.error("[workflow-email] In Progress email skipped: missing customer email");
    return { queued: false, sent: false, skipped: true };
  }

  return queueOperationalEmail({
    type: "customer_status_update",
    to: context.customerEmail,
    subject: "Your Project Has Started - Grubel Property Services",
    text: lines([
      `Hi ${value(context.customerName, "there")},`,
      "",
      "Work has started on your project. We will continue to keep you updated.",
      "",
      `Service: ${value(context.serviceType)}`,
      `Property: ${value(context.propertyAddress)}`,
      "",
      "Grubel Property Services",
    ]),
    data: { ...context, status: "In Progress" },
  });
}

export async function sendCompletedCustomerEmail(context: ProjectEmailContext) {
  if (!context.customerEmail) {
    console.error("[workflow-email] Completed email skipped: missing customer email");
    return { queued: false, sent: false, skipped: true };
  }

  return queueOperationalEmail({
    type: "customer_status_update",
    to: context.customerEmail,
    subject: "Your Project Is Complete - Grubel Property Services",
    text: lines([
      `Hi ${value(context.customerName, "there")},`,
      "",
      "Your project work has been completed. Grubel Property Services will follow up with any final closeout details.",
      "",
      `Service: ${value(context.serviceType)}`,
      `Property: ${value(context.propertyAddress)}`,
      "",
      "Grubel Property Services",
    ]),
    data: { ...context, status: "Completed" },
  });
}

export async function sendClosedCustomerEmail(context: ProjectEmailContext) {
  if (!context.customerEmail) {
    console.error("[workflow-email] Closed email skipped: missing customer email");
    return { queued: false, sent: false, skipped: true };
  }

  return queueOperationalEmail({
    type: "customer_status_update",
    to: context.customerEmail,
    subject: "Thank You - Grubel Property Services",
    text: lines([
      `Hi ${value(context.customerName, "there")},`,
      "",
      "Thank you for working with Grubel Property Services. Your project has been closed.",
      "",
      `Service: ${value(context.serviceType)}`,
      `Property: ${value(context.propertyAddress)}`,
      "",
      "Grubel Property Services",
    ]),
    data: { ...context, status: "Closed" },
  });
}
