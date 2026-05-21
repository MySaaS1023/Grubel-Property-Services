"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "@/components/Button";

const services = [
  "Maintenance & Repair",
  "Property Preservation",
  "Builds & Remodels",
  "General Property Questions",
  "Other",
];
const propertyTypes = ["Residential", "Commercial", "Rental", "Other"];
const occupancyOptions = ["Occupied", "Vacant", "Unknown"];
const timeWindows = ["Morning", "Afternoon", "Evening", "Flexible"];
const contactMethods = ["Phone", "Video Call"];
const acceptedFileTypes = new Set(["image/jpeg", "image/png", "application/pdf"]);
const maxFileSize = 10 * 1024 * 1024;

type FormState = "idle" | "submitting" | "success" | "error";

export function RequestServiceForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? []);
    setFileError("");
    setSelectedFiles([]);

    for (const file of files) {
      if (!acceptedFileTypes.has(file.type)) {
        setFileError("Uploads must be JPG, JPEG, PNG, or PDF files.");
        event.currentTarget.value = "";
        return;
      }

      if (file.size > maxFileSize) {
        setFileError("Each uploaded file must be 10MB or smaller.");
        event.currentTarget.value = "";
        return;
      }
    }

    setSelectedFiles(files);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    formData.set("subject", "Service Request");
    formData.set("message", String(formData.get("projectDescription") ?? ""));

    try {
      const response = await fetch("/api/service-request", {
        method: "POST",
        body: formData,
      });
      const data = await response.json().catch(() => null);
      const success = response.ok || data?.success === true;

      if (!success || data?.success === false) {
        setState("error");
        setMessage(
          data?.error
            ? `We could not submit your request. ${data.error}`
            : "We could not submit your request. Please check required fields and try again.",
        );
        return;
      }

      event.currentTarget.reset();
      setSelectedFiles([]);
      setFileError("");
      setState("success");
      setMessage(
        "Your request was submitted successfully. Our team will review your information and follow up soon.",
      );
    } catch {
      setState("error");
      setMessage(
        "We could not submit your request. Please check required fields and try again.",
      );
    }
  }

  return (
    <form className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-soft" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Full Name" name="fullName" required />
        <Field label="Email" name="email" required type="email" />
        <Field label="Phone" name="phone" required type="tel" />
        <SelectField label="Service Needed" name="serviceNeeded" options={services} required />
        <Field label="Property Address" name="propertyAddress" required />
        <SelectField label="Property Type" name="propertyType" options={propertyTypes} required />
        <SelectField label="Occupied or Vacant" name="occupancyStatus" options={occupancyOptions} required />
        <Field label="Preferred Date" name="preferredDate" type="date" />
        <SelectField
          label="Preferred Time Window"
          name="preferredTimeWindow"
          options={timeWindows}
        />
        <SelectField
          label="Preferred Contact Method"
          name="preferredContactMethod"
          options={contactMethods}
          required
        />
      </div>
      <label className="grid gap-2 text-sm font-bold text-navy">
        Project Description
        <textarea
          className="min-h-36 rounded-md border border-slate-300 px-3 py-3 text-sm font-normal text-charcoal outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          name="projectDescription"
          required
        />
      </label>
      <div className="grid gap-2 text-sm font-bold text-navy">
        Upload Photos or Documents
        <p className="text-sm font-normal leading-6 text-charcoal/65">
          Upload photos of the property, repair area, damage, or related
          documents if available.
        </p>
        <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-stonewash px-4 py-6 text-center text-sm font-semibold text-charcoal transition hover:border-accent hover:bg-white">
          <span>Choose photos or documents</span>
          <span className="mt-1 text-xs font-normal text-charcoal/60">
            JPG, PNG, JPEG, or PDF
          </span>
          <input
            accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
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
        {fileError ? (
          <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-800">
            {fileError}
          </p>
        ) : null}
      </div>
      <p className="text-sm leading-6 text-charcoal/65">
        For virtual inspections, choose a preferred date and time window for a
        walkthrough or review.
      </p>
      <label className="grid gap-2 text-sm font-bold text-navy">
        Additional Notes
        <textarea
          className="min-h-28 rounded-md border border-slate-300 px-3 py-3 text-sm font-normal text-charcoal outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          name="additionalNotes"
        />
      </label>
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
        {state === "submitting" ? "Submitting..." : "Submit Request"}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-navy">
      {label}
      <input
        className="min-h-11 rounded-md border border-slate-300 px-3 text-sm font-normal text-charcoal outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
        name={name}
        required={required}
        type={type}
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
  required = false,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-navy">
      {label}
      <select
        className="min-h-11 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-charcoal outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
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
    </label>
  );
}
