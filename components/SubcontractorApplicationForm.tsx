"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";

export function SubcontractorApplicationForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/subcontractor-application", {
        method: "POST",
        body: new FormData(event.currentTarget),
      });
      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error ?? "Please review the application and try again.");
        return;
      }

      event.currentTarget.reset();
      setStatus("success");
      setMessage("Application received. Grubel Property Services will review your information.");
    } catch {
      setStatus("error");
      setMessage("Unable to submit application. Please try again.");
    }
  }

  return (
    <form className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Full name" name="fullName" required />
        <Field label="Business name (optional)" name="businessName" />
        <Field label="Phone" name="phone" required type="tel" />
        <Field label="Email" name="email" required type="email" />
        <Field label="Trade/Skill" name="tradeSkill" required />
        <Field label="Residential or Commercial experience" name="experienceType" required />
        <Field label="Years of experience" name="yearsExperience" required />
        <Field label="Service areas" name="serviceAreas" required />
        <Field label="Availability" name="availability" required />
        <FileField label="Upload ID" name="identification" />
        <FileField label="Upload insurance documents" name="insuranceDocuments" />
        <FileField label="Upload licenses/certifications" name="licenses" />
        <FileField label="Portfolio/work photos" name="portfolio" />
      </div>
      <label className="grid gap-2 text-sm font-bold text-navy">
        Additional notes
        <textarea
          className="min-h-32 rounded-md border border-slate-300 px-3 py-3 text-sm font-normal text-charcoal outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          name="notes"
        />
      </label>
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

function Field({
  label,
  name,
  required = false,
  type = "text",
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
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

function FileField({ label, name }: { label: string; name: string }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-navy">
      {label}
      <input
        className="rounded-md border border-slate-300 px-3 py-2 text-sm font-normal text-charcoal file:mr-4 file:rounded-md file:border-0 file:bg-navy file:px-3 file:py-2 file:text-sm file:font-bold file:text-white"
        name={name}
        type="file"
      />
    </label>
  );
}
