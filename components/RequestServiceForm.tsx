"use client";

import { ChangeEvent, FormEvent, ReactNode, useState } from "react";
import { Button } from "@/components/Button";

const services = [
  "Maintenance & Repair",
  "Property Preservation",
  "Builds & Remodels",
];
const walkthroughOptions = [
  "Live Virtual Walkthrough",
  "Uploaded Photos/Videos Only",
];
const propertyTypes = ["Residential", "Commercial", "Rental / Investment Property", "Other"];
const occupancyOptions = [
  "Occupied",
  "Vacant",
  "Move-In Prep",
  "Move-Out / Turnover",
  "Unknown",
];
const contactMethods = ["Phone", "Video Call"];
const timeWindows = ["Morning", "Afternoon", "Evening"];
const acceptedFileTypes = new Set([
  "image/jpeg",
  "image/png",
  "application/pdf",
  "video/mp4",
  "video/quicktime",
]);
const acceptedFileExtensions = new Set(["jpg", "jpeg", "png", "pdf", "mp4", "mov"]);
const maxFileSize = 25 * 1024 * 1024;

type FormState = "idle" | "submitting" | "success" | "error";
type FieldErrors = Record<string, string>;

const requiredFields = [
  { name: "fullName", label: "Full Name" },
  { name: "email", label: "Email" },
  { name: "phone", label: "Phone" },
  { name: "preferredContactMethod", label: "Preferred Contact Method" },
  { name: "propertyAddress", label: "Property Address" },
  { name: "serviceNeeded", label: "Service Needed" },
  { name: "walkthroughOption", label: "Walkthrough Option" },
  { name: "propertyType", label: "Property Type" },
  { name: "occupancyStatus", label: "Occupancy Status" },
  { name: "projectDescription", label: "Project Description" },
];

export function RequestServiceForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? []);
    setFileError("");
    setSelectedFiles([]);

    for (const file of files) {
      if (!isAcceptedFile(file)) {
        setFileError("Uploads must be JPG, JPEG, PNG, PDF, MP4, or MOV files.");
        event.currentTarget.value = "";
        return;
      }

      if (file.size > maxFileSize) {
        setFileError("Each uploaded file must be 25MB or smaller.");
        event.currentTarget.value = "";
        return;
      }
    }

    setSelectedFiles(files);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const validationErrors = getClientValidationErrors(form, selectedFiles);
    setFieldErrors(validationErrors);
    setMessage("");

    if (Object.keys(validationErrors).length) {
      setState("error");
      const firstError = Object.values(validationErrors)[0];
      setMessage(`Please fix this field before submitting: ${firstError}`);
      return;
    }

    setState("submitting");

    const formData = new FormData(form);
    formData.set("subject", "Project Request");
    formData.set("message", String(formData.get("projectDescription") ?? ""));
    console.log("Request service submit payload", {
      fields: Object.fromEntries(
        Array.from(formData.entries())
          .filter(([, value]) => typeof value === "string")
          .map(([key, value]) => [key, value]),
      ),
      files: selectedFiles.map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
      })),
    });

    try {
      const response = await fetch("/api/service-request", {
        method: "POST",
        body: formData,
      });
      const responseText = await response.text();
      let data: Record<string, unknown> | null = null;
      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch {
        data = { rawResponse: responseText };
      }
      console.log("Request service submit response", {
        status: response.status,
        ok: response.ok,
        data,
      });
      const successIndicator =
        data?.success === true ||
        data?.emailSent === true ||
        data?.requestSaved === true;
      const success = response.ok || successIndicator;

      if (!success) {
        setState("error");
        setMessage(
          typeof data?.error === "string"
            ? `We could not submit your request. ${data.error}`
            : "We could not submit your request. Please check required fields and try again.",
        );
        return;
      }

      form.reset();
      setSelectedFiles([]);
      setFileError("");
      setState("success");
      setMessage(
        "Your request was submitted successfully. Our team will review your information and follow up soon.",
      );
    } catch (error) {
      console.error("Request service submit failed", error);
      setState("error");
      setMessage(
        "We could not submit your request. Please check required fields and try again.",
      );
    }
  }

  return (
    <form className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-soft" onSubmit={handleSubmit}>
      <FormSection title="Customer Information">
        <div className="grid gap-5 md:grid-cols-2">
          <Field error={fieldErrors.fullName} label="Full Name" name="fullName" required />
          <Field error={fieldErrors.email} label="Email" name="email" required type="email" />
          <Field error={fieldErrors.phone} label="Phone Number" name="phone" required type="tel" />
          <SelectField
            error={fieldErrors.preferredContactMethod}
            label="Preferred Contact Method"
            name="preferredContactMethod"
            options={contactMethods}
            required
          />
        </div>
      </FormSection>

      <FormSection title="Property Information">
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            error={fieldErrors.propertyAddress}
            label="Property Address"
            name="propertyAddress"
            required
          />
          <SelectField
            error={fieldErrors.propertyType}
            label="Property Type"
            name="propertyType"
            options={propertyTypes}
            required
          />
          <SelectField
            error={fieldErrors.occupancyStatus}
            label="Occupancy Status"
            name="occupancyStatus"
            options={occupancyOptions}
            required
          />
        </div>
      </FormSection>

      <FormSection title="Project Information">
        <div className="grid gap-5">
          <SelectField
            error={fieldErrors.serviceNeeded}
            label="Service Needed"
            name="serviceNeeded"
            options={services}
            required
          />
          <label className="grid gap-2 text-sm font-bold text-navy">
            Project Description
            <textarea
              className="min-h-36 rounded-md border border-slate-300 px-3 py-3 text-sm font-normal text-charcoal outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              name="projectDescription"
              required
            />
            {fieldErrors.projectDescription ? (
              <span className="text-xs font-semibold text-red-700">
                {fieldErrors.projectDescription}
              </span>
            ) : null}
          </label>
        </div>
      </FormSection>

      <div className="grid gap-2 text-sm font-bold text-navy">
        <h2 className="text-lg font-black text-navy">Media Uploads</h2>
        <p className="text-sm font-normal leading-6 text-charcoal/65">
          Upload photos, videos, property documents, repair area details, or
          related documents if available.
        </p>
        <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-stonewash px-4 py-6 text-center text-sm font-semibold text-charcoal transition hover:border-accent hover:bg-white">
          <span>Choose photos or documents</span>
          <span className="mt-1 text-xs font-normal text-charcoal/60">
            JPG, JPEG, PNG, PDF, MP4, or MOV. 25MB max per file.
          </span>
          <input
            accept=".jpg,.jpeg,.png,.pdf,.mp4,.mov,image/jpeg,image/png,application/pdf,video/mp4,video/quicktime"
            className="sr-only"
            multiple
            name="photos"
            onChange={handleFileChange}
            type="file"
          />
        </label>
        {selectedFiles.length ? (
          <div className="rounded-md bg-white p-3 text-sm font-semibold text-charcoal/75">
            <p>
              {selectedFiles.length} file{selectedFiles.length === 1 ? "" : "s"} selected
            </p>
            <ul className="mt-2 grid gap-1 text-xs font-normal text-charcoal/70">
              {selectedFiles.map((file) => (
                <li key={`${file.name}-${file.size}`}>{file.name}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {fileError || fieldErrors.photos ? (
          <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-800">
            {fileError || fieldErrors.photos}
          </p>
        ) : null}
      </div>

      <FormSection title="Walkthrough Preference">
        <SelectField
          error={fieldErrors.walkthroughOption}
          label="Walkthrough Preference"
          name="walkthroughOption"
          options={walkthroughOptions}
          required
        />
      </FormSection>

      <FormSection title="Availability">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Preferred Days" name="preferredDays" />
          <SelectField
            label="Preferred Time Range"
            name="preferredTimeWindow"
            options={timeWindows}
          />
        </div>
      </FormSection>
      <p className="text-sm leading-6 text-charcoal/65">
        For live virtual walkthroughs, share your preferred days and time range
        so the team can coordinate next steps.
      </p>
      {message ? (
        <p
          className={`rounded-md px-4 py-3 text-sm font-semibold ${
            state === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          }`}
        >
          {message}
        </p>
      ) : null}
      <Button disabled={state === "submitting"} type="submit">
        {state === "submitting" ? "Submitting..." : "Submit Project Request"}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-navy">
      {label}
      <input
        className={`min-h-11 rounded-md border px-3 text-sm font-normal text-charcoal outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 ${
          error ? "border-red-500" : "border-slate-300"
        }`}
        name={name}
        required={required}
        type={type}
      />
      {error ? <span className="text-xs font-semibold text-red-700">{error}</span> : null}
    </label>
  );
}

function FormSection({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="grid gap-4">
      <h2 className="text-lg font-black text-navy">{title}</h2>
      {children}
    </section>
  );
}

function SelectField({
  label,
  name,
  options,
  required = false,
  error,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
  error?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-navy">
      {label}
      <select
        className={`min-h-11 rounded-md border bg-white px-3 text-sm font-normal text-charcoal outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 ${
          error ? "border-red-500" : "border-slate-300"
        }`}
        defaultValue=""
        name={name}
        required={required}
      >
        <option disabled value="">
          Select an option
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? <span className="text-xs font-semibold text-red-700">{error}</span> : null}
    </label>
  );
}

function getClientValidationErrors(form: HTMLFormElement, files: File[]) {
  const formData = new FormData(form);
  const errors: FieldErrors = {};

  for (const field of requiredFields) {
    const value = String(formData.get(field.name) ?? "").trim();
    if (!value) {
      errors[field.name] = `${field.label} is required.`;
    }
  }

  const email = String(formData.get("email") ?? "").trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  for (const file of files) {
    if (!isAcceptedFile(file)) {
      errors.photos = "Uploads must be JPG, JPEG, PNG, PDF, MP4, or MOV files.";
      break;
    }

    if (file.size > maxFileSize) {
      errors.photos = "Each uploaded file must be 25MB or smaller.";
      break;
    }
  }

  return errors;
}

function isAcceptedFile(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  return acceptedFileTypes.has(file.type) || acceptedFileExtensions.has(extension);
}
