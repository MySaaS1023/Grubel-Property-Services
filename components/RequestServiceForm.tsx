"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";

const services = ["Virtual Inspection", "Repair", "Turnover Prep", "Other"];
const propertyTypes = ["Residential", "Commercial", "Rental", "Other"];
const occupancyOptions = ["Occupied", "Vacant", "Unknown"];
const timeWindows = ["Morning", "Afternoon", "Evening", "Flexible"];
const contactMethods = ["Phone", "Email", "Text"];

type FormState = "idle" | "submitting" | "success" | "error";

export function RequestServiceForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

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
      const data = await response.json();

      if (!response.ok) {
        setState("error");
        setMessage(data.error ?? "Please check the form and try again.");
        return;
      }

      event.currentTarget.reset();
      setState("success");
      setMessage(
        "Thank you. We received your request. Grubel Property Services will review the details and follow up with next steps or a quote number.",
      );
    } catch {
      setState("error");
      setMessage("Something went wrong. Please try again in a moment.");
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
            type="file"
          />
        </label>
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
