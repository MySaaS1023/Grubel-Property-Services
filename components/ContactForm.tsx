"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "@/components/Button";

type FormState = "idle" | "submitting" | "success" | "error";
const acceptedFileTypes = new Set(["image/jpeg", "image/png", "application/pdf"]);
const acceptedFileExtensions = new Set(["jpg", "jpeg", "png", "pdf"]);
const maxFileSize = 25 * 1024 * 1024;

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? []);
    setFileError("");
    setSelectedFiles([]);

    for (const file of files) {
      if (!isAcceptedFile(file)) {
        setFileError("Uploads must be JPG, JPEG, PNG, or PDF files.");
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

    if (fileError) {
      setState("error");
      setMessage(fileError);
      return;
    }

    setState("submitting");
    setMessage("");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/contact-message", {
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
      console.log("Contact form response", {
        status: response.status,
        ok: response.ok,
        data,
      });

      const success =
        response.ok || data?.success === true || data?.emailSent === true;

      if (!success) {
        setState("error");
        setMessage(
          typeof data?.error === "string"
            ? data.error
            : "Please check the form and try again.",
        );
        return;
      }

      event.currentTarget.reset();
      setSelectedFiles([]);
      setFileError("");
      setState("success");
      setMessage(
        "Thanks. Your message was received and Grubel Property Services will follow up soon.",
      );
    } catch (error) {
      console.error("Contact form submit failed", error);
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
        <Field label="Subject" name="subject" required />
      </div>
      <label className="grid gap-2 text-sm font-bold text-navy">
        Message
        <textarea
          className="min-h-36 rounded-md border border-slate-300 px-3 py-3 text-sm font-normal text-charcoal outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          name="message"
          required
        />
      </label>
      <div className="grid gap-2 text-sm font-bold text-navy">
        Upload Photos or Documents
        <p className="text-sm font-normal leading-6 text-charcoal/65">
          Upload photos, project images, property concerns, or related documents
          if available.
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
        {state === "submitting" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}

function isAcceptedFile(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  return acceptedFileTypes.has(file.type) || acceptedFileExtensions.has(extension);
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
