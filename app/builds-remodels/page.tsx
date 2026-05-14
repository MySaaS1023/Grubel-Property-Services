import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";

const interiorImprovements = [
  "Kitchen updates",
  "Bathroom remodels",
  "Flooring installation",
  "Trim and cabinet upgrades",
  "Drywall and paint improvements",
];

const exteriorImprovements = [
  "Fencing",
  "Siding support",
  "Exterior upgrades",
  "Curb appeal improvements",
  "Cleanup and prep",
];

const propertyUpgrades = [
  "Rental improvements",
  "Tenant improvements",
  "Modernization projects",
  "Occupancy upgrades",
  "Commercial improvements",
];

export default function BuildsRemodelsPage() {
  return (
    <>
      <PageHero
        eyebrow="BUILDS & REMODELS"
        title="Builds & Remodels"
        description="Construction-minded improvement, renovation, and remodeling services for residential, rental, and commercial properties."
        primaryCta={{ href: "/request-service", label: "Request Service" }}
      />
      <ServiceList title="Interior Improvements" items={interiorImprovements} />
      <ServiceList title="Exterior Improvements" items={exteriorImprovements} muted />
      <ServiceList title="Property Upgrades" items={propertyUpgrades} />
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-4xl rounded-lg border border-accent/30 bg-accent/10 p-6">
            <h2 className="text-2xl font-black text-navy">Important Notice</h2>
            <p className="mt-3 leading-7 text-charcoal/75">
              Project availability and scope may depend on property needs,
              scheduling, materials, permitting, and licensed trade
              requirements.
            </p>
          </div>
        </div>
      </section>
      <CTASection title="Request Builds & Remodels Support" />
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
            <li
              className="break-inside-avoid border-l-4 border-accent bg-white/70 py-2 pl-4 font-bold text-charcoal"
              key={item}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
