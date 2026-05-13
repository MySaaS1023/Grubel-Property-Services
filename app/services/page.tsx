import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";
import { ServiceCard } from "@/components/ServiceCard";

const services = [
  {
    title: "Virtual Inspection",
    href: "/inspection",
    description:
      "Virtual property inspections, visible condition walkthroughs, and maintenance check notes for owners who want a practical view of property condition.",
  },
  {
    title: "Repair",
    href: "/repair",
    description:
      "Minor repair and upkeep support for everyday property needs, punch-list items, and hands-on maintenance tasks.",
  },
  {
    title: "Turnover Prep",
    href: "/turnover-prep",
    description:
      "Rental and home readiness support between occupants, including basic fixes, touch-ups, and move-in preparation.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Grubel Property Services"
        title="Practical property service for checks, upkeep, and readiness."
        description="Grubel Property Services keeps the scope clear: virtual inspections, preventative property checks, minor repairs, maintenance support, and turnover prep."
        primaryCta={{ href: "/contact", label: "Request Service" }}
      />
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </section>
      <CTASection
        title="Need help choosing the right service?"
        description="Send the property details and Grubel Property Services can point the request toward the right next step."
      />
    </>
  );
}
