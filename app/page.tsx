import { Button } from "@/components/Button";
import { CTASection } from "@/components/CTASection";
import { ServiceCard } from "@/components/ServiceCard";

const services = [
  {
    title: "Virtual Inspection",
    description:
      "Virtual property inspections and visible condition walkthroughs to help catch small issues early.",
    href: "/inspection",
  },
  {
    title: "Repair",
    description:
      "Maintenance and minor repair support to keep your property in good condition.",
    href: "/repair",
  },
  {
    title: "Turnover Prep",
    description: "Property readiness support between tenants or occupants.",
    href: "/turnover-prep",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(197,138,75,0.18),transparent_38%),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:auto,64px_64px,64px_64px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.85fr] lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-accent">
              Grubel Property Services
            </p>
            <h1 className="mt-5 text-4xl font-black leading-[1.08] text-white sm:text-6xl sm:leading-[1.06]">
              Property Inspection, Maintenance & Repair You Can Count On
            </h1>
            <p className="mt-4 text-lg leading-8 text-white/84">
              Grubel Property Services helps homeowners, landlords, and property
              managers keep properties maintained, repaired, and move-in ready.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button href="/request-service">Request Service</Button>
              <Button
                className="border-white/25 bg-white text-navy hover:border-white hover:text-accentDark"
                href="/services"
                variant="outline"
              >
                View Services
              </Button>
            </div>
          </div>
          <div className="mx-auto w-full max-w-md rounded-lg border border-white/15 bg-white/8 p-5 shadow-sm backdrop-blur lg:mx-0 lg:justify-self-end">
            <div className="grid gap-4">
              {services.map((service) => (
                <div className="rounded-md bg-white p-5 shadow-sm" key={service.title}>
                  <div className="text-lg font-black text-navy">
                    {service.title}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-charcoal/72">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-black text-navy">Our Core Services</h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </div>
      </section>

      <CTASection
        buttonHref="/request-service"
        buttonLabel="Request Service"
        description="Request service today and tell us what your property needs."
        title="Ready to keep your property in shape?"
      />
    </>
  );
}
