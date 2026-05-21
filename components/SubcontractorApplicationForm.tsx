"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";

type FieldConfig = {
  label: string;
  name: string;
  required?: boolean;
  type?: "text" | "email" | "tel" | "textarea" | "file";
};

type SubcontractorApplicationFormProps = {
  applicationType: "handyman" | "residential" | "commercial" | "general";
  fields?: FieldConfig[];
};

const defaultFields: FieldConfig[] = [
  { label: "Full name", name: "fullName", required: true },
  { label: "Business name (optional)", name: "businessName" },
  { label: "Phone", name: "phone", required: true, type: "tel" },
  { label: "Email", name: "email", required: true, type: "email" },
  { label: "Trade/Skill", name: "tradeSkill", required: true },
  {
    label: "Residential or Commercial experience",
    name: "experienceType",
    required: true,
  },
  { label: "Years of experience", name: "yearsExperience", required: true },
  { label: "Service areas", name: "serviceAreas", required: true },
  { label: "Availability", name: "availability", required: true },
  { label: "Upload ID", name: "identification", type: "file" },
  { label: "Upload insurance documents", name: "insuranceDocuments", type: "file" },
  { label: "Upload licenses/certifications", name: "licenses", type: "file" },
  { label: "Portfolio/work photos", name: "portfolio", type: "file" },
  { label: "Additional notes", name: "notes", type: "textarea" },
];

export function SubcontractorApplicationForm({
  applicationType,
  fields = defaultFields,
}: SubcontractorApplicationFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("submitting");
    setMessage("");

    const formData = new FormData(form);
    formData.set("applicationType", applicationType);

    try {
      const response = await fetch("/api/subcontractor-application", {
        method: "POST",
        body: formData,
      });
      const data = await response.json().catch(() => null);
      console.log("Subcontractor application response", {
        status: response.status,
        ok: response.ok,
        data,
      });
      const success =
        response.ok ||
        data?.success === true ||
        data?.emailSent === true ||
        data?.applicationSaved === true;

      if (!success) {
        setStatus("error");
        setMessage(
          data?.error ?? "Unable to submit application. Please try again.",
        );
        return;
      }

      form.reset();
      setStatus("success");
      setMessage(
        "Your application was submitted successfully. Our team will review your information and follow up soon.",
      );
    } catch {
      setStatus("error");
      setMessage("Unable to submit application. Please try again.");
    }
  }

  return (
    <form className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        {fields.map((field) => (
          <FormField key={field.name} {...field} />
        ))}
      </div>
      {message ? (
        <p
          className={`rounded-md px-4 py-3 text-sm font-semibold ${
            status === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          }`}
        >
          {message}
        </p>
      ) : null}
      <Button disabled={status === "submitting"} type="submit">
        {status === "submitting" ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
}

function FormField({
  label,
  name,
  required = false,
  type = "text",
}: FieldConfig) {
  if (type === "textarea") {
    return (
      <label className="grid gap-2 text-sm font-bold text-navy md:col-span-2">
        {label}
        <textarea
          className="min-h-32 rounded-md border border-slate-300 px-3 py-3 text-sm font-normal text-charcoal outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          name={name}
          required={required}
        />
      </label>
    );
  }

  if (type === "file") {
    return (
      <label className="grid gap-2 text-sm font-bold text-navy">
        {label}
        <input
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-normal text-charcoal file:mr-4 file:rounded-md file:border-0 file:bg-navy file:px-3 file:py-2 file:text-sm file:font-bold file:text-white"
          name={name}
          required={required}
          type="file"
        />
      </label>
    );
  }

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
