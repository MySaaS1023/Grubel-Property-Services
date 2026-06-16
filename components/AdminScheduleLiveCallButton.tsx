"use client";

import { useState } from "react";

export function AdminScheduleLiveCallButton({
  requestId,
}: {
  requestId: string;
}) {
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const schedulePath = `/schedule-consultation?requestId=${encodeURIComponent(requestId)}`;
  const scheduleUrl = `https://grubelps.com${schedulePath}`;

  async function copyLink() {
    await navigator.clipboard.writeText(scheduleUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  async function sendLink() {
    setSending(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/send-scheduling-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });
      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        error?: string;
        message?: string;
      } | null;

      if (!response.ok || !data?.success) {
        setMessageType("error");
        setMessage(
          `Scheduling link email failed: ${data?.error ?? "Unknown email error."}`,
        );
        return;
      }

      setMessageType("success");
      setMessage(data.message ?? "Scheduling link sent to customer.");
    } catch (error) {
      setMessageType("error");
      setMessage(
        `Scheduling link email failed: ${
          error instanceof Error ? error.message : "Unknown email error."
        }`,
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="grid gap-2">
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
        <button
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-navy transition hover:border-accent"
          disabled={sending}
          onClick={sendLink}
          type="button"
        >
          {sending ? "Sending..." : "Email Link"}
        </button>
      </div>
      {message ? (
        <p
          className={`max-w-xs rounded-md px-3 py-2 text-xs font-bold ${
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
