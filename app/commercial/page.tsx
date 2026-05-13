import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";

export default function CommercialPage() {
  return (
    <>
      <PageHero
        eyebrow="Commercial"
        title="Commercial Property Support"
        description="Operational maintenance, repair coordination, readiness checks, and project support for commercial property owners and operators."
        primaryCta={{ href: "/request-service", label: "Request Service" }}
      />
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 leading-7 text-charcoal/75 sm:px-6 lg:px-8">
          <p>
            Commercial support may include maintenance walkthroughs, repair
            documentation, vendor coordination, safety concern communication, and
            practical property readiness assistance.
          </p>
        </div>
      </section>
      <CTASection title="Coordinate commercial property support with Grubel Property Services." />
    </>
  );
}
