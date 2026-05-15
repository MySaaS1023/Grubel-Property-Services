import { Button } from "@/components/Button";
import { CTASection } from "@/components/CTASection";
import { ServiceCard } from "@/components/ServiceCard";

const services = [
  {
    title: "Maintenance & Repair",
    description:
      "Hands-on maintenance, repair, and property support services designed to keep residential, rental, and commercial properties functional and operational.",
    href: "/repair",
  },
  {
    title: "Property Preservation",
    description:
      "Property preservation and occupancy-readiness services focused on vacancy upkeep, turnover support, and overall property condition.",
    href: "/turnover-prep",
  },
  {
    title: "Builds & Remodels",
    description:
      "Construction-minded improvement and remodeling services for residential, rental, and commercial properties.",
    href: "/builds-remodels",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(197,138,75,0.18),transparent_38%),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:auto,64px_64px,64px_64px]" />
        <div className="site-container relative grid items-center gap-12 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-accent">
              Grubel Property Services
            </p>
            <h1 className="mt-5 text-4xl font-black leading-[1.08] text-white sm:text-6xl sm:leading-[1.06]">
              Property Maintenance, Repair & Preservation You Can Count On
            </h1>
            <p className="mt-4 text-lg leading-8 text-white/90">
              Grubel Property Services helps homeowners, landlords, and property
              managers keep properties maintained, repaired, and move-in ready.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button href="/contact">Contact Us</Button>
              <Button
                className="border-white/25 bg-white text-navy hover:border-white hover:text-accentDark"
                href="/services"
                variant="outline"
              >
                View Services
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-white/15 shadow-2xl shadow-black/35">
            <img
              alt="Grubel Property Services team performing property service work"
              className="h-full w-full object-cover"
              src="/hero/hero-services.png"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="site-container">
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
