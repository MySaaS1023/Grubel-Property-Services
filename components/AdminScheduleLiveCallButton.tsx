"use client";

import { useState } from "react";

export function AdminScheduleLiveCallButton({
  customerEmail,
  requestId,
}: {
  customerEmail: string;
  requestId: string;
}) {
  const [copied, setCopied] = useState(false);
  const schedulePath = `/schedule-consultation?request=${encodeURIComponent(requestId)}`;
  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://grubelps.com";
  const scheduleUrl = `${origin}${schedulePath}`;
  const emailHref = `mailto:${encodeURIComponent(customerEmail)}?subject=${encodeURIComponent(
    "Schedule Your Grubel Project Consultation",
  )}&body=${encodeURIComponent(
    `Please use this link to schedule your live project consultation:\n\n${scheduleUrl}`,
  )}`;

  async function copyLink() {
    await navigator.clipboard.writeText(scheduleUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <a
        className="rounded-md bg-navy px-3 py-2 text-xs font-bold text-white transition hover:bg-accentDark"
        href={schedulePath}
        rel="noreferrer"
        target="_blank"
      >
        Schedule Live Call
      </a>
      <button
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-navy transition hover:border-accent"
        onClick={copyLink}
        type="button"
      >
        {copied ? "Copied" : "Copy Link"}
      </button>
      <a
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-navy transition hover:border-accent"
        href={emailHref}
      >
        Email Link
      </a>
    </div>
  );
}
