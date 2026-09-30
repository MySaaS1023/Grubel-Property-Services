import { CTASection } from "@/components/CTASection";
import { HomeCoreServices } from "@/components/HomeCoreServices";

export default function ServicesPage() {
  return (
    <>
      <section className="bg-stonewash">
        <div className="site-container pb-10 pt-16 lg:pb-12 lg:pt-20">
          <div className="mx-auto max-w-4xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-accentDark">
              SERVICES
            </p>
            <h1 className="text-4xl font-black leading-tight text-navy sm:text-5xl">
              Simple services. Dependable property care.
            </h1>
            <p className="mt-5 text-lg leading-8 text-charcoal/75">
              Start with the service your property needs today. Grubel currently
              provides professional cleaning and routine property care, with
              additional property maintenance services planned for the future.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white pb-16 pt-8">
        <div className="site-container">
          <div className="mx-auto max-w-4xl">
            <HomeCoreServices
              ctaLabels={{
                "Cleaning Services": "View Cleaning Services",
                "Property Management": "View Property Care",
              }}
            />
          </div>
        </div>
      </section>

      <CTASection
        buttonHref="/request-service"
        buttonLabel="Request Service"
        description="Tell us about your property and we’ll help with the next step."
        title="Not sure which service you need?"
      />
    </>
  );
}
