import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";

const items = [
  "Visible condition walkthroughs",
  "Preventative inspection notes",
  "Maintenance check observations",
  "Exterior and interior condition awareness",
  "Follow-up recommendations for minor upkeep",
];

export default function InspectionPage() {
  return (
    <>
      <PageHero
        eyebrow="Inspection"
        title="Preventative property checks without the overcomplication."
        description="Grubel Property Services provides visible condition walkthroughs and maintenance check support for owners who want to catch obvious upkeep needs early."
        primaryCta={{ href: "/contact", label: "Request Inspection" }}
        secondaryCta={{ href: "/services", label: "View All Services" }}
      />
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <h2 className="text-3xl font-black text-navy">What This Covers</h2>
            <p className="mt-4 leading-7 text-charcoal/72">
              This service is designed as a practical property check and visible
              condition walkthrough. It is not a technical, structural,
              engineering, or code compliance inspection.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <div className="rounded-lg border border-slate-200 bg-stonewash p-5 font-bold text-charcoal" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTASection title="Schedule a preventative property check with Grubel Property Services." />
    </>
  );
}
