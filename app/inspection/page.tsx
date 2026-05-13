import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";

const includes = [
  "Video walkthrough review",
  "Property condition observations",
  "Exterior visible-condition review",
  "Interior visible-condition review",
  "Maintenance concern identification",
  "Tenant turnover readiness observations",
  "Repair recommendations",
  "Photo/video submission review",
  "Property readiness feedback",
];

const audiences = [
  "Out-of-state owners",
  "Landlords",
  "Property managers",
  "Rental property owners",
  "Investors",
];

export default function InspectionPage() {
  return (
    <>
      <PageHero
        eyebrow="Virtual Inspection"
        title="Virtual Inspection"
        description="Virtual property inspections and visible condition walkthroughs designed to help property owners identify maintenance concerns, turnover needs, and repair opportunities before they become larger issues."
        primaryCta={{ href: "/contact", label: "Request Virtual Inspection" }}
        secondaryCta={{ href: "/services", label: "View All Services" }}
      />
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <h2 className="text-3xl font-black text-navy">
              What a Virtual Inspection Includes
            </h2>
            <p className="mt-4 leading-7 text-charcoal/72">
              A practical review for maintenance planning, repair awareness, and
              property readiness decisions.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {includes.map((item) => (
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
          <div>
            <h2 className="text-3xl font-black text-navy">Who This Helps</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {audiences.map((item) => (
              <div className="rounded-lg border border-slate-200 bg-white p-5 font-bold text-charcoal" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-accent/30 bg-accent/10 p-6">
            <h2 className="text-2xl font-black text-navy">Important Notice</h2>
            <p className="mt-3 leading-7 text-charcoal/75">
              Grubel Property Services does NOT provide licensed home
              inspections or engineering reports. Virtual inspections are visual
              property condition walkthroughs intended for maintenance and
              operational support purposes only.
            </p>
          </div>
        </div>
      </section>

      <CTASection title="Request Virtual Inspection" />
    </>
  );
}
