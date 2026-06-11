export const workflowStages = [
  "intake_received",
  "callback_requested",
  "walkthrough_needed",
  "media_uploaded",
  "pm_review",
  "rom_build",
  "vendor_rfq",
  "vendor_quote_received",
  "sow_prepared",
  "approval_to_proceed",
  "payment_to_start",
  "scheduling",
  "scheduled",
  "vendor_check_in",
  "work_in_progress",
  "before_photos_uploaded",
  "after_photos_uploaded",
  "customer_signoff",
  "final_payment",
  "vendor_payout",
  "closed",
  "canceled",
] as const;

export type WorkflowStage = (typeof workflowStages)[number];

export const adminWorkflowStageOptions = [
  { label: "PM Review", value: "pm_review" },
  { label: "ROM Build", value: "rom_build" },
  { label: "Vendor RFQ", value: "vendor_rfq" },
  { label: "SOW Prepared", value: "sow_prepared" },
  { label: "Approval to Proceed", value: "approval_to_proceed" },
  { label: "Payment to Start", value: "payment_to_start" },
  { label: "Scheduling", value: "scheduling" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Work in Progress", value: "work_in_progress" },
  { label: "Customer Sign-Off", value: "customer_signoff" },
  { label: "Final Payment", value: "final_payment" },
  { label: "Vendor Payout", value: "vendor_payout" },
  { label: "Closed", value: "closed" },
] satisfies Array<{ label: string; value: WorkflowStage }>;

export function getWorkflowStageForWalkthroughOption(option: string): WorkflowStage {
  if (option === "Live Virtual Walkthrough") {
    return "walkthrough_needed";
  }

  if (option === "Upload Photos/Videos Only") {
    return "media_uploaded";
  }

  if (option === "Request Callback First") {
    return "callback_requested";
  }

  return "intake_received";
}

export function formatWorkflowStage(value: string) {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
