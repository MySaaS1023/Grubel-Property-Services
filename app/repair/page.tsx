import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";

const maintenanceServices = [
  "Drywall patching and repair",
  "Paint touch-ups",
  "Door adjustments and repairs",
  "Cabinet hardware replacement",
  "Fixture replacement",
  "Caulking and sealing",
  "Fence and gate repairs",
  "Trim repairs",
  "Minor plumbing fixture replacement",
  "Minor electrical fixture replacement",
  "Trash-out coordination",
  "Exterior cleanup",
  "General property upkeep",
];

const repairServices = [
  "Flooring replacement support",
  "Interior repair coordination",
  "Exterior repair coordination",
  "Water damage repair coordination",
  "Turnover repair punch lists",
  "Move-out repair support",
  "Property damage repair support",
  "Tenant damage repairs",
  "Commercial maintenance repairs",
  "Safety concern corrections",
  "Structural issue referral coordination",
];

const projectSupport = [
  "Contractor coordination",
  "Scope walkthroughs",
  "Repair documentation",
  "Project oversight support",
  "Vendor communication",
  "Scheduling coordination",
];

export default function RepairPage() {
  return (
    <>
      <PageHero
        eyebrow="Repair"
        title="Property Repair & Maintenance Services"
        description="Hands-on repair, maintenance, and property improvement support for residential and commercial properties."
        primaryCta={{ href: "/contact", label: "Request Repair Service" }}
      />
      <ServiceList title="Maintenance Services" items={maintenanceServices} />
      <ServiceList title="Repair Services" items={repairServices} muted />
      <ServiceList title="Project Support" items={projectSupport} />
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-accent/30 bg-accent/10 p-6">
            <h2 className="text-2xl font-black text-navy">Important Notice</h2>
            <p className="mt-3 leading-7 text-charcoal/75">
              Some services may require licensed specialty contractors depending
              on project scope and local requirements.
            </p>
          </div>
        </div>
      </section>
      <CTASection title="Request Repair Service" />
    </>
  );
}

function ServiceList({
  title,
  items,
  muted = false,
}: {
  title: string;
  items: string[];
  muted?: boolean;
}) {
  return (
    <section className={`${muted ? "bg-stonewash" : "bg-white"} py-16`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black text-navy">{title}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              className="rounded-lg border border-slate-200 bg-white p-5 font-bold text-charcoal shadow-sm"
              key={item}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
