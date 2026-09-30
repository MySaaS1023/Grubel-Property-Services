"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ServiceDetail = {
  title: string;
  description: string;
  included: string[];
};

type ActiveService = {
  title: string;
  description: string;
  items: string[];
  modalIntro: string;
  details: ServiceDetail[];
};

const activeServices: ActiveService[] = [
  {
    title: "Cleaning Services",
    description:
      "Professional cleaning for the spaces that matter most in your home or property.",
    items: ["Whole House", "Garage", "Pantry", "Closet", "Bedroom"],
    modalIntro: "Choose a cleaning service below to learn more about what’s included.",
    details: [
      {
        title: "Whole House",
        description:
          "A full-home cleaning option for customers who need dependable care across the main living spaces.",
        included: [
          "General surface cleaning",
          "Common area cleaning",
          "Kitchen and bathroom attention",
          "Bedroom and living space tidying",
        ],
      },
      {
        title: "Garage",
        description:
          "A focused garage cleaning service for spaces that need organization, sweeping, and cleanup support.",
        included: [
          "Surface sweep-out",
          "Light debris cleanup",
          "General organization support",
          "Accessible surface dusting",
        ],
      },
      {
        title: "Pantry",
        description:
          "A detailed pantry cleaning option for shelves, storage areas, and food-storage spaces.",
        included: [
          "Shelf wipe-downs",
          "Expired item identification support",
          "Crumb and debris removal",
          "Basic organization support",
        ],
      },
      {
        title: "Closet",
        description:
          "A closet cleaning service for customers who need a cleaner, easier-to-manage storage area.",
        included: [
          "Floor and accessible surface cleaning",
          "Dusting and wipe-downs",
          "Basic organization support",
          "Light debris removal",
        ],
      },
      {
        title: "Bedroom",
        description:
          "A bedroom cleaning option focused on keeping personal spaces clean, neat, and comfortable.",
        included: [
          "Dusting accessible surfaces",
          "Floor cleaning support",
          "General tidying",
          "Trash and light debris removal",
        ],
      },
    ],
  },
  {
    title: "Property Management",
    description:
      "Routine property checks to help you stay informed about the condition of your property.",
    items: ["Routine Check"],
    modalIntro:
      "Property care services designed to help you stay informed about the condition of your property.",
    details: [
      {
        title: "Routine Check",
        description:
          "A routine property check for owners, landlords, and rental properties that need periodic eyes on the space.",
        included: [
          "Visual property condition check",
          "Exterior or accessible area observations",
          "Photo or note documentation when appropriate",
          "Basic condition update for the customer",
        ],
      },
    ],
  },
];

export function HomeCoreServices() {
  const [activeService, setActiveService] = useState<ActiveService | null>(null);
  const [expandedItem, setExpandedItem] = useState("");

  useEffect(() => {
    if (!activeService) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveService(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeService]);

  function openService(service: ActiveService) {
    setActiveService(service);
    setExpandedItem("");
  }

  return (
    <>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {activeServices.map((service) => (
          <button
            className="group block rounded-lg border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-accent/50 hover:shadow-soft"
            key={service.title}
            onClick={() => openService(service)}
            type="button"
          >
            <CardContent
              description={service.description}
              items={service.items}
              title={service.title}
            />
          </button>
        ))}
        <div className="group block rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <CardContent
            description="Additional property maintenance services are planned as Grubel Property Services continues to grow."
            locked
            title="Property Maintenance"
          />
        </div>
      </div>

      {activeService ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/75 px-4 py-6"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setActiveService(null);
            }
          }}
          role="dialog"
        >
          <div className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
              <div>
                <h3 className="text-2xl font-black text-navy">{activeService.title}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-charcoal/70">
                  {activeService.modalIntro}
                </p>
              </div>
              <button
                aria-label="Close service details"
                className="rounded-md border border-slate-200 px-3 py-1 text-lg font-black text-navy transition hover:border-accent hover:text-accentDark"
                onClick={() => setActiveService(null)}
                type="button"
              >
                ×
              </button>
            </div>
            <div className="grid gap-3 p-5">
              {activeService.details.map((detail) => {
                const isExpanded = expandedItem === detail.title;

                return (
                  <div className="rounded-lg border border-slate-200" key={detail.title}>
                    <button
                      aria-expanded={isExpanded}
                      className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left text-base font-black text-navy transition hover:text-accentDark"
                      onClick={() => setExpandedItem(isExpanded ? "" : detail.title)}
                      type="button"
                    >
                      <span>{detail.title}</span>
                      <span className="text-xl">{isExpanded ? "−" : "+"}</span>
                    </button>
                    {isExpanded ? (
                      <div className="grid gap-4 border-t border-slate-200 px-4 py-4">
                        <div>
                          <h4 className="text-sm font-black uppercase tracking-[0.14em] text-accentDark">
                            Service Description
                          </h4>
                          <p className="mt-2 text-sm leading-6 text-charcoal/75">
                            {detail.description}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-black uppercase tracking-[0.14em] text-accentDark">
                            What’s Included
                          </h4>
                          <ul className="mt-2 grid gap-1 text-sm font-semibold leading-6 text-charcoal/75">
                            {detail.included.map((item) => (
                              <li key={item}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                        <Link
                          className="inline-flex w-fit items-center justify-center rounded-md bg-accent px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-navy transition hover:bg-accentDark hover:text-white"
                          href="/request-service"
                        >
                          Request This Service
                        </Link>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function CardContent({
  description,
  items = [],
  locked = false,
  title,
}: {
  description: string;
  items?: string[];
  locked?: boolean;
  title: string;
}) {
  return (
    <>
      <div className="h-1.5 w-14 rounded-full bg-accent" />
      <h3 className="mt-6 text-xl font-black text-navy">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-charcoal/72">{description}</p>
      {items.length ? (
        <ul className="mt-4 grid gap-1 text-sm font-semibold leading-6 text-charcoal/70">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      <span className="mt-5 inline-flex text-sm font-bold text-accentDark transition group-hover:text-navy">
        {locked ? "Phase 3 — Coming Soon" : "Learn More"}
      </span>
    </>
  );
}
