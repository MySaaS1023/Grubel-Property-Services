"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type ChatResponse = {
  text: string;
  links?: Array<{
    href: string;
    label: string;
  }>;
};

const responses: Record<string, ChatResponse> = {
  services: {
    text: "Grubel Property Services offers Maintenance & Repair, Property Preservation, and Builds & Remodels.",
    links: [
      { href: "/services", label: "View Services" },
      { href: "/request-service", label: "Request Service" },
    ],
  },
  request: {
    text: "You can submit your property details, photos, and service needs through our request form. Our team will review the request and follow up with next steps, consultation options, and a quote number when applicable.",
    links: [{ href: "/request-service", label: "Request Service" }],
  },
  portal: {
    text: "If you already received a quote number, use the Customer Portal to view quote details, payments, project updates, and service status.",
    links: [{ href: "/customer-login", label: "Customer Portal" }],
  },
  contact: {
    text: "You can contact Grubel Property Services at Phone: (480) 420-7398 or Email: info@grubelps.com.",
    links: [{ href: "/contact", label: "Contact Us" }],
  },
  work: {
    text: "Interested subcontractors can apply under Work With Us.",
    links: [
      { href: "/work-with-us/handyman", label: "Handy Man" },
      { href: "/work-with-us/residential", label: "Residential" },
      { href: "/work-with-us/commercial", label: "Commercial" },
    ],
  },
  faq: {
    text: "You can find common questions about services, quotes, payments, subcontractors, and policies on the FAQ page.",
    links: [{ href: "/faq", label: "FAQ" }],
  },
  unknown: {
    text: "I can help with services, quotes, customer portal access, contact information, or Work With Us applications. Please choose one of the options below.",
  },
};

const quickActions = [
  { key: "services", label: "Services" },
  { key: "request", label: "Request Service" },
  { key: "portal", label: "Customer Portal" },
  { key: "contact", label: "Contact" },
  { key: "work", label: "Work With Us" },
  { key: "faq", label: "FAQ" },
];

export function SiteChatbot() {
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState<ChatResponse>({
    text: "Hi, welcome to Grubel Property Services. I can help you find services, request support, access your customer portal, or apply to work with us.",
  });
  const [input, setInput] = useState("");

  function chooseResponse(key: string) {
    setResponse(responses[key] ?? responses.unknown);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const key = detectIntent(input);
    chooseResponse(key);
    setInput("");
  }

  return (
    <div className="fixed bottom-5 right-5 z-[60] max-w-[calc(100vw-2.5rem)]">
      {open ? (
        <div className="w-[min(360px,calc(100vw-2.5rem))] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-navy px-4 py-3 text-white">
            <div>
              <div className="text-sm font-black">Grubel Property Services</div>
              <div className="text-xs text-white/70">Website helper</div>
            </div>
            <button
              aria-label="Close chat"
              className="rounded-md px-2 py-1 text-sm font-black text-white/80 hover:bg-white/10"
              onClick={() => setOpen(false)}
              type="button"
            >
              ×
            </button>
          </div>
          <div className="grid gap-4 p-4">
            <div className="rounded-lg bg-stonewash p-3 text-sm leading-6 text-charcoal">
              {response.text}
              {response.links?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {response.links.map((link) => (
                    <Link
                      className="rounded-md bg-navy px-3 py-2 text-xs font-bold text-white transition hover:bg-accentDark"
                      href={link.href}
                      key={link.href}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <button
                  className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-navy transition hover:border-accent hover:text-accentDark"
                  key={action.key}
                  onClick={() => chooseResponse(action.key)}
                  type="button"
                >
                  {action.label}
                </button>
              ))}
            </div>
            <form className="flex gap-2" onSubmit={handleSubmit}>
              <input
                className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask a question"
                type="text"
                value={input}
              />
              <button
                className="rounded-md bg-accent px-3 py-2 text-sm font-black text-white transition hover:bg-accentDark"
                type="submit"
              >
                Send
              </button>
            </form>
            <p className="text-xs leading-5 text-charcoal/55">
              This assistant provides general website guidance. For
              project-specific questions, please contact Grubel Property
              Services directly.
            </p>
          </div>
        </div>
      ) : (
        <button
          className="rounded-full bg-navy px-5 py-3 text-sm font-black text-white shadow-2xl transition hover:bg-accentDark"
          onClick={() => setOpen(true)}
          type="button"
        >
          Help
        </button>
      )}
    </div>
  );
}

function detectIntent(value: string) {
  const normalized = value.toLowerCase();

  if (/service|repair|maintenance|remodel|preservation/.test(normalized)) {
    return "services";
  }

  if (/quote|estimate|request/.test(normalized)) {
    return "request";
  }

  if (/portal|payment|status|project/.test(normalized)) {
    return "portal";
  }

  if (/phone|email|contact/.test(normalized)) {
    return "contact";
  }

  if (/subcontractor|work|handyman|residential|commercial/.test(normalized)) {
    return "work";
  }

  if (/faq|question|help/.test(normalized)) {
    return "faq";
  }

  return "unknown";
}
