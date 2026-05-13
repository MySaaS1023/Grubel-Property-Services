import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";

const turnoverServices = [
  "Vacancy checks",
  "Move-in / move-out readiness",
  "Trash-out coordination",
  "Turnover preparation",
  "Final walkthrough support",
  "Property condition upkeep",
  "Lock/change coordination support",
  "Vendor coordination",
  "Preservation documentation",
  "Occupancy readiness support",
  "Ongoing property care",
];

const designedFor = [
  "Property managers",
  "Landlords",
  "Rental owners",
  "Multi-unit operators",
  "Commercial property owners",
];

export default function TurnoverPrepPage() {
  return (
    <>
      <PageHero
        eyebrow="Property Preservation"
        title="Property Preservation"
        description="Property preservation and occupancy-readiness services focused on vacancy upkeep, turnover coordination, ongoing property care, and overall property condition support."
        primaryCta={{ href: "/request-service", label: "Request Property Preservation" }}
      />
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="text-3xl font-black text-navy">
              Preservation Services Include
            </h2>
            <p className="mt-4 leading-7 text-charcoal/72">
              Practical support for vacancy upkeep, property condition, and
              occupancy readiness.
            </p>
          </div>
          <ul className="columns-1 gap-8 space-y-3 sm:columns-2">
            {turnoverServices.map((item) => (
              <li className="break-inside-avoid border-l-4 border-accent py-2 pl-4 font-bold text-charcoal" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="bg-stonewash py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-2">
          <h2 className="text-3xl font-black text-navy">Designed For</h2>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-base font-bold text-charcoal">
            {designedFor.map((item) => (
              <span key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
      <CTASection title="Request Property Preservation" />
    </>
  );
}
