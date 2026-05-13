export type ServiceRequestInput = {
  fullName: string;
  email: string;
  phone: string;
  propertyAddress?: string;
  city?: string;
  serviceNeeded: string;
  preferredDate?: string;
  message: string;
};

type ValidationResult =
  | { success: true; data: ServiceRequestInput }
  | { success: false; error: string };

const allowedServices = new Set([
  "Inspection",
  "Virtual Inspection",
  "Repair",
  "Turnover Prep",
  "Other",
]);

export function validateServiceRequest(input: unknown): ValidationResult {
  if (!input || typeof input !== "object") {
    return { success: false, error: "Invalid request body." };
  }

  const body = input as Record<string, unknown>;
  const fullName = toCleanString(body.fullName);
  const email = toCleanString(body.email);
  const phone = toCleanString(body.phone);
  const serviceNeeded = toCleanString(body.serviceNeeded);
  const message = toCleanString(body.message);

  if (!fullName) {
    return { success: false, error: "Full name is required." };
  }

  if (!email || !isValidEmail(email)) {
    return { success: false, error: "A valid email is required." };
  }

  if (!phone) {
    return { success: false, error: "Phone is required." };
  }

  if (!serviceNeeded || !allowedServices.has(serviceNeeded)) {
    return { success: false, error: "Service needed is required." };
  }

  if (!message) {
    return { success: false, error: "Message is required." };
  }

  return {
    success: true,
    data: {
      fullName,
      email,
      phone,
      propertyAddress: toCleanString(body.propertyAddress),
      city: toCleanString(body.city),
      serviceNeeded,
      preferredDate: toCleanString(body.preferredDate),
      message,
    },
  };
}

function toCleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
