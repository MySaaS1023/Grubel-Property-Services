"use client";

import { FormEvent, useState } from "react";

export function AdminSendZoomLink({
  customerEmail,
  requestId,
  scheduledDateTime,
}: {
  customerEmail: string;
  requestId: string;
  scheduledDateTime: string;
}) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const zoomLink = String(formData.get("zoomLink") ?? "").trim();
    const optionalMessage = String(formData.get("optionalMessage") ?? "").trim();

    if (!zoomLink) {
      setMessageType("error");
      setMessage("Zoom link is required.");
      return;
    }

    setSending(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/send-zoom-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, zoomLink, optionalMessage }),
      });
      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        error?: string;
        message?: string;
      } | null;

      if (!response.ok || !data?.success) {
        setMessageType("error");
        setMessage(`Zoom link email failed: ${data?.error ?? "Unknown email error."}`);
        return;
      }

      setMessageType("success");
      setMessage(data.message ?? "Zoom link sent to customer.");
      form.reset();
    } catch (error) {
      setMessageType("error");
      setMessage(
        `Zoom link email failed: ${
          error instanceof Error ? error.message : "Unknown email error."
        }`,
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="grid gap-2">
      <button
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-navy transition hover:border-accent"
        onClick={() => {
          setOpen((current) => !current);
          setMessage("");
        }}
        type="button"
      >
        Send Zoom Link
      </button>

      {open ? (
        <form
          className="grid min-w-[300px] gap-3 rounded-md border border-slate-200 bg-stonewash p-4"
          onSubmit={handleSubmit}
        >
          <label className="grid gap-1 text-xs font-bold text-navy">
            Customer Email
            <input
              className="min-h-10 rounded-md border border-slate-300 bg-slate-100 px-3 text-xs font-normal text-charcoal"
              readOnly
              value={customerEmail}
            />
          </label>
          <label className="grid gap-1 text-xs font-bold text-navy">
            Scheduled Consultation
            <input
              className="min-h-10 rounded-md border border-slate-300 bg-slate-100 px-3 text-xs font-normal text-charcoal"
              readOnly
              value={scheduledDateTime}
            />
          </label>
          <label className="grid gap-1 text-xs font-bold text-navy">
            Zoom Link
            <input
              className="min-h-10 rounded-md border border-slate-300 bg-white px-3 text-xs font-normal text-charcoal outline-none transition focus:border-accent"
              name="zoomLink"
              placeholder="https://zoom.us/j/..."
              required
              type="url"
            />
          </label>
          <label className="grid gap-1 text-xs font-bold text-navy">
            Optional Message
            <textarea
              className="min-h-20 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-normal text-charcoal outline-none transition focus:border-accent"
              name="optionalMessage"
            />
          </label>
          <button
            className="rounded-md bg-navy px-3 py-2 text-xs font-bold text-white transition hover:bg-accentDark disabled:opacity-60"
            disabled={sending}
            type="submit"
          >
            {sending ? "Sending..." : "Send Email"}
          </button>
        </form>
      ) : null}

      {message ? (
        <p
          className={`max-w-sm rounded-md px-3 py-2 text-xs font-bold ${
            messageType === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
