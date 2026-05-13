"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";

const services = ["Inspection", "Repair", "Turnover Prep", "Other"];

type FormState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const formData = new FormData(event.currentTarget);

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
        "Thanks. Your request was received and Grubel Property Services will follow up soon.",
      );
    } catch {
      setState("error");
      setMessage("Something went wrong. Please try again in a moment.");
    }
  }

  return (
    <form className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-soft" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Full name" name="fullName" required />
        <Field label="Email" name="email" required type="email" />
        <Field label="Phone" name="phone" required type="tel" />
        <Field label="Property address" name="propertyAddress" />
        <Field label="City" name="city" />
        <label className="grid gap-2 text-sm font-bold text-navy">
          Service needed
          <select
            className="min-h-11 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-charcoal outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            name="serviceNeeded"
            required
            defaultValue=""
          >
            <option disabled value="">
              Select a service
            </option>
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </label>
        <Field label="Preferred date" name="preferredDate" type="date" />
      </div>
      <label className="grid gap-2 text-sm font-bold text-navy">
        Message / Describe the issue
        <textarea
          className="min-h-36 rounded-md border border-slate-300 px-3 py-3 text-sm font-normal text-charcoal outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          name="message"
          required
        />
      </label>
      <div className="grid gap-2 text-sm font-bold text-navy">
        Photo Upload
        <p className="text-sm font-normal leading-6 text-charcoal/65">
          Upload photos of the property, repairs, damage, or project area if
          available.
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
      {message ? (
        <p
          className={`rounded-md px-4 py-3 text-sm font-semibold ${
            state === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
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
