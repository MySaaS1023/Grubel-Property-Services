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
        eyebrow="Maintenance & Repair"
        title="Property Maintenance & Repair"
        description="Construction-minded maintenance, repair, and property support services designed to keep residential, rental, and commercial properties functional, maintained, and operational."
        primaryCta={{ href: "/request-service", label: "Request Maintenance & Repair" }}
      />
      <ServiceList title="Maintenance Services" items={maintenanceServices} />
      <ServiceList title="Repair Services" items={repairServices} muted />
      <ServiceList title="Project Support" items={projectSupport} />
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-4xl rounded-lg border border-accent/30 bg-accent/10 p-6">
            <h2 className="text-2xl font-black text-navy">Important Notice</h2>
            <p className="mt-3 leading-7 text-charcoal/75">
              Some services may require licensed specialty contractors depending
              on project scope and local requirements.
            </p>
          </div>
        </div>
      </section>
      <CTASection title="Request Property Maintenance & Repair" />
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
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-black text-navy">{title}</h2>
        <ul className="mt-6 columns-1 gap-8 space-y-3 sm:columns-2 lg:columns-3">
          {items.map((item) => (
            <li className="break-inside-avoid border-l-4 border-accent bg-white/70 py-2 pl-4 font-bold text-charcoal" key={item}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
