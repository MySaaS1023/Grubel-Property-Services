import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";

export default function ResidentialPage() {
  return (
    <>
      <PageHero
        eyebrow="Residential"
        title="Residential Property Services"
        description="Maintenance, repair, turnover, and readiness support for homes, rentals, and residential investment properties."
        primaryCta={{ href: "/request-service", label: "Request Service" }}
      />
      <section className="bg-white py-16">
        <div className="site-container leading-7 text-charcoal/75">
          <p className="mx-auto max-w-4xl">
            Grubel Property Services helps residential property owners handle
            maintenance concerns, coordinate repair needs, prepare properties
            between occupants, and keep homes in better operating condition.
          </p>
        </div>
      </section>
      <CTASection title="Keep your residential property in better shape." />
    </>
  );
}
