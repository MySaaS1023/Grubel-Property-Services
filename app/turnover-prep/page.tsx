import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";

const steps = [
  "Walkthrough for visible readiness items",
  "Minor touch-ups and basic fixes",
  "Maintenance check before new occupants arrive",
  "Owner or manager punch-list support",
  "Final readiness communication",
];

export default function TurnoverPrepPage() {
  return (
    <>
      <PageHero
        eyebrow="Turnover Prep"
        title="Move-in ready support between occupants."
        description="Grubel Property Services helps prepare rentals and homes between tenants or occupants with practical readiness checks, basic upkeep, and minor repair support."
        primaryCta={{ href: "/contact", label: "Request Turnover Prep" }}
      />
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div>
            <h2 className="text-3xl font-black text-navy">Turnover Support</h2>
            <p className="mt-4 leading-7 text-charcoal/72">
              Turnover prep helps owners reduce downtime and present a cleaner,
              more complete property for the next occupant.
            </p>
          </div>
          <div className="grid gap-4">
            {steps.map((step) => (
              <div className="rounded-lg border border-slate-200 bg-stonewash p-5 font-bold text-charcoal" key={step}>
                {step}
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTASection title="Prepare the property for its next occupant." />
    </>
  );
}
