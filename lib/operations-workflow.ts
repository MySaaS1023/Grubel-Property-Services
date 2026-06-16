export const requestStatuses = ["New Request", "Consultation Scheduled"] as const;

export const projectStatuses = [
  "Vendor Pricing",
  "Awaiting Customer Approval",
  "Scheduled",
  "In Progress",
  "Completed",
  "Closed",
] as const;

export type RequestStatus = (typeof requestStatuses)[number];
export type ProjectStatus = (typeof projectStatuses)[number];

export function isRequestStatus(value: string): value is RequestStatus {
  return requestStatuses.includes(value as RequestStatus);
}

export function isProjectStatus(value: string): value is ProjectStatus {
  return projectStatuses.includes(value as ProjectStatus);
}
