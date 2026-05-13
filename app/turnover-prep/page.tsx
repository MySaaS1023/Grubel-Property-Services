import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";

const turnoverServices = [
  "Move-out condition walkthroughs",
  "Punch-list creation",
  "Trash-out coordination",
  "Minor repair coordination",
  "Cleaning coordination",
  "Paint touch-up coordination",
  "Fixture replacement",
  "Readiness checks",
  "Maintenance recommendations",
  "Vendor coordination",
  "Lock/change coordination support",
  "Final property readiness walkthrough",
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
        eyebrow="Turnover Prep"
        title="Turnover Preparation Services"
        description="Property turnover support designed to help prepare units, homes, and commercial spaces for the next occupant."
        primaryCta={{ href: "/contact", label: "Request Turnover Support" }}
      />
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <h2 className="text-3xl font-black text-navy">
              Turnover Services Include
            </h2>
            <p className="mt-4 leading-7 text-charcoal/72">
              Practical coordination and readiness support between occupants.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {turnoverServices.map((item) => (
              <div
                className="rounded-lg border border-slate-200 bg-stonewash p-5 font-bold text-charcoal"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-stonewash py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <h2 className="text-3xl font-black text-navy">Designed For</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {designedFor.map((item) => (
              <div className="rounded-lg border border-slate-200 bg-white p-5 font-bold text-charcoal" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTASection title="Request Turnover Support" />
    </>
  );
}
