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
  walkthroughOption?: string;
  projectDescription?: string;
  uploadedFileNames?: string[];
  scheduleUrl?: string;
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

type ConsultationEmailContext = {
  serviceRequestId?: string;
  appointmentId?: string;
  customerName?: string;
  customerEmail?: string;
  serviceType?: string;
  propertyAddress?: string;
  appointmentDate?: string;
  timeWindow?: string;
  projectManagerName?: string;
  zoomLink?: string;
};

type SchedulingLinkEmailContext = {
  serviceRequestId?: string;
  customerName?: string;
  customerEmail?: string;
  propertyAddress?: string;
  scheduleLink: string;
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

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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
      "Next step: schedule your live project consultation with a Grubel Project Manager.",
      context.scheduleUrl ? `Schedule Project Consultation: ${context.scheduleUrl}` : "",
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
      `Walkthrough Option: ${value(context.walkthroughOption)}`,
      context.scheduleUrl
        ? `Schedule Project Consultation: ${context.scheduleUrl}`
        : "Schedule Project Consultation: Not available",
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

export async function sendConsultationScheduledCustomerEmail(
  context: ConsultationEmailContext,
) {
  if (!context.customerEmail) {
    console.error(
      "[workflow-email] Consultation Scheduled customer email skipped: missing email",
    );
    return { queued: false, sent: false, skipped: true };
  }

  return queueOperationalEmail({
    type: "appointment_scheduled",
    to: context.customerEmail,
    subject: "Project Consultation Scheduled - Grubel Property Services",
    text: lines([
      `Hi ${value(context.customerName, "there")},`,
      "",
      "Your live project consultation has been scheduled.",
      "",
      `Date: ${value(context.appointmentDate)}`,
      `Time Slot: ${value(context.timeWindow)}`,
      `Project Manager: ${value(context.projectManagerName)}`,
      `Service: ${value(context.serviceType)}`,
      `Property: ${value(context.propertyAddress)}`,
      context.zoomLink ? `Zoom Link: ${context.zoomLink}` : "Zoom Link: To be provided",
      "",
      "Grubel Property Services",
    ]),
    data: { ...context, status: "Consultation Scheduled" },
  });
}

export async function sendConsultationScheduledAdminEmail(
  context: ConsultationEmailContext,
) {
  return queueOperationalEmail({
    type: "appointment_scheduled",
    to: businessEmail(),
    subject: "Consultation Scheduled - Grubel Property Services",
    text: lines([
      "A customer scheduled a project consultation.",
      "",
      `Customer: ${value(context.customerName)}`,
      `Email: ${value(context.customerEmail)}`,
      `Service: ${value(context.serviceType)}`,
      `Property: ${value(context.propertyAddress)}`,
      `Date: ${value(context.appointmentDate)}`,
      `Time Slot: ${value(context.timeWindow)}`,
      `Project Manager: ${value(context.projectManagerName)}`,
      `Zoom Link: ${value(context.zoomLink)}`,
      `Request ID: ${value(context.serviceRequestId)}`,
      `Appointment ID: ${value(context.appointmentId)}`,
    ]),
    data: { ...context, status: "Consultation Scheduled" },
  });
}

export async function sendSchedulingLinkEmail(context: SchedulingLinkEmailContext) {
  if (!context.customerEmail) {
    console.error("[workflow-email] Scheduling link email skipped: missing email", {
      requestId: context.serviceRequestId,
    });
    return { queued: false, sent: false, skipped: true };
  }

  const text = lines([
    `Hi ${value(context.customerName, "there")},`,
    "",
    "Thank you for contacting Grubel Property Services.",
    "",
    "We have received your project request and are ready to get started.",
    "",
    "The next step is to schedule a consultation with one of our Project Managers so we can review your project and discuss the best path forward.",
    "",
    "Please use the link below to choose a time that works for you:",
    "",
    context.scheduleLink,
    "",
    "During the consultation, we will:",
    "- Review your project details",
    "- Discuss any photos, videos, or concerns",
    "- Answer your questions",
    "- Determine next steps",
    "",
    "If you need assistance, please contact us at (480) 420-7398 or reply to this email.",
    "",
    "We look forward to speaking with you and helping with your project.",
    "",
    "Thank you,",
    "",
    "Grubel Property Services",
    "Phone: (480) 420-7398",
    "Email: info@grubelps.com",
  ]);
  const safeLink = escapeHtml(context.scheduleLink);
  const html = [
    '<div style="font-family:Arial,sans-serif;color:#1f2933;line-height:1.6;">',
    `<p>Hi ${escapeHtml(value(context.customerName, "there"))},</p>`,
    "<p>Thank you for contacting Grubel Property Services.</p>",
    "<p>We have received your project request and are ready to get started.</p>",
    "<p>The next step is to schedule a consultation with one of our Project Managers so we can review your project and discuss the best path forward.</p>",
    "<p>Please use the link below to choose a time that works for you:</p>",
    `<p><a href="${safeLink}" style="display:inline-block;background:#c98f43;color:#08213d;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:6px;">Schedule Live Call</a></p>`,
    `<p>Or copy and paste this link:<br><a href="${safeLink}">${safeLink}</a></p>`,
    "<p>During the consultation, we will:</p>",
    "<ul><li>Review your project details</li><li>Discuss any photos, videos, or concerns</li><li>Answer your questions</li><li>Determine next steps</li></ul>",
    "<p>If you need assistance, please contact us at (480) 420-7398 or reply to this email.</p>",
    "<p>We look forward to speaking with you.</p>",
    "<p>Thank you,<br>Grubel Property Services</p>",
    '<p>Phone: (480) 420-7398<br>Email: <a href="mailto:info@grubelps.com">info@grubelps.com</a></p>',
    "</div>",
  ].join("");

  return queueOperationalEmail({
    type: "appointment_scheduled",
    to: context.customerEmail,
    subject: "Schedule Your Project Consultation - Grubel Property Services",
    text,
    html,
    data: {
      ...context,
      template: "scheduling_link",
      propertyAddress: context.propertyAddress,
    },
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
