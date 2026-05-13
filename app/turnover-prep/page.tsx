import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";

const vacancySupport = [
  "Vacancy checks",
  "Property condition observations",
  "Upkeep coordination",
  "Occupancy monitoring",
];

const readinessServices = [
  "Move-in/move-out preparation",
  "Turnover coordination",
  "Trash-out coordination",
  "Final walkthrough support",
  "Occupancy readiness",
];

const preservationServices = [
  "Ongoing property upkeep",
  "Preservation support",
  "Vendor coordination",
  "Maintenance recommendations",
  "Readiness documentation",
];

export default function TurnoverPrepPage() {
  return (
    <>
      <PageHero
        eyebrow="Property Preservation"
        title="Property Preservation"
        description="Property preservation and occupancy-readiness services designed to support vacant, rental, residential, and commercial properties."
        primaryCta={{ href: "/request-service", label: "Request Service" }}
      />
      <ServiceList title="Vacancy Support" items={vacancySupport} />
      <ServiceList title="Turnover & Readiness" items={readinessServices} muted />
      <ServiceList title="Property Preservation Services" items={preservationServices} />
      <CTASection title="Request Property Preservation" />
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
