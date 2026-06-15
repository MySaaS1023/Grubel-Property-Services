export type ContactMessageInput = {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export type ContactValidationResult =
  | { success: true; data: ContactMessageInput }
  | {
      success: false;
      error: string;
      fieldErrors: Partial<Record<keyof ContactMessageInput, string>>;
    };

export function validateContactMessage(input: unknown): ContactValidationResult {
  if (!input || typeof input !== "object") {
    return {
      success: false,
      error: "Invalid contact form data.",
      fieldErrors: {},
    };
  }

  const body = input as Record<string, unknown>;
  const fullName = clean(body.fullName);
  const email = clean(body.email);
  const phone = clean(body.phone);
  const subject = clean(body.subject);
  const message = clean(body.message);
  const fieldErrors: Partial<Record<keyof ContactMessageInput, string>> = {};

  if (!fullName) {
    fieldErrors.fullName = "Full name is required.";
  }

  if (!email) {
    fieldErrors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (!phone) {
    fieldErrors.phone = "Phone is required.";
  }

  if (!subject) {
    fieldErrors.subject = "Subject is required.";
  }

  if (!message) {
    fieldErrors.message = "Message is required.";
  }

  if (Object.keys(fieldErrors).length) {
    return {
      success: false,
      error: Object.values(fieldErrors)[0] ?? "Please check the form and try again.",
      fieldErrors,
    };
  }

  return {
    success: true,
    data: {
      fullName,
      email,
      phone,
      subject,
      message,
    },
  };
}

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
