import { Button } from "@/components/Button";
import { CTASection } from "@/components/CTASection";
import { ServiceCard } from "@/components/ServiceCard";

const services = [
  {
    title: "Maintenance & Repair",
    description:
      "Hands-on maintenance, repair, and property support services designed to keep residential and commercial properties functional and operational.",
    href: "/request-service",
  },
  {
    title: "Property Preservation",
    description:
      "Property preservation and occupancy-readiness services focused on vacancy upkeep, turnover support, and overall property condition.",
    href: "/request-service",
  },
  {
    title: "Builds & Remodels",
    description:
      "Construction-minded improvement and remodeling services for residential, rental, and commercial properties.",
    href: "/request-service",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(197,138,75,0.18),transparent_38%),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:auto,64px_64px,64px_64px]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.05fr_0.85fr] lg:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-accent">
              Grubel Property Services
            </p>
            <h1 className="mt-5 text-4xl font-black leading-[1.08] text-white sm:text-6xl sm:leading-[1.06]">
              Property Maintenance, Repair & Preservation You Can Count On
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
          <HeroWorkflowCollage />
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
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

function HeroWorkflowCollage() {
  return (
    <div className="mx-auto w-full max-w-xl lg:mx-0 lg:justify-self-end">
      <div className="grid gap-3 sm:grid-cols-2 md:hidden">
        <WorkflowPanel
          label="Consultation"
          src="/hero/consultation.jpg"
        />
        <WorkflowPanel
          label="Property Check"
          src="/hero/property-check.jpg"
        />
        <WorkflowPanel
          label="Maintenance"
          src="/hero/maintenance.jpg"
        />
        <WorkflowPanel
          label="Preservation"
          src="/hero/property-preservation.jpg"
        />
      </div>

      <div className="relative hidden min-h-[510px] md:block">
        <div className="absolute left-10 right-4 top-14 h-72 overflow-hidden rounded-lg border border-white/18 bg-gradient-to-br from-navy via-charcoal to-navy shadow-2xl shadow-black/35 rotate-[-1.5deg]">
          <img
            alt="Property preservation room prepared for occupancy"
            className="absolute inset-0 h-full w-full object-cover"
            src="/hero/property-preservation.jpg"
          />
          <ImageLabel className="left-4 top-4" label="Preservation" />
        </div>

        <div className="absolute left-0 top-0 h-40 w-64 overflow-hidden rounded-lg border border-white/20 bg-gradient-to-br from-navy via-charcoal to-navy shadow-xl shadow-black/30 rotate-[-4deg]">
          <img
            alt="Phone photo used for a property consultation"
            className="absolute inset-0 h-full w-full object-cover"
            src="/hero/consultation.jpg"
          />
          <ImageLabel className="left-3 top-3" label="Consultation" />
        </div>

        <div className="absolute bottom-16 right-0 h-48 w-72 overflow-hidden rounded-lg border border-white/20 bg-gradient-to-br from-navy via-charcoal to-navy shadow-xl shadow-black/35 rotate-[3deg]">
          <img
            alt="Maintenance work inside a property"
            className="absolute inset-0 h-full w-full object-cover"
            src="/hero/maintenance.jpg"
          />
          <ImageLabel className="left-3 top-3" label="Maintenance" />
        </div>

        <div className="absolute bottom-0 left-6 h-44 w-72 overflow-hidden rounded-lg border border-white/20 bg-gradient-to-br from-navy via-charcoal to-navy shadow-xl shadow-black/35 rotate-[-2deg]">
          <img
            alt="Exterior property condition check"
            className="absolute inset-0 h-full w-full object-cover"
            src="/hero/property-check.jpg"
          />
          <ImageLabel className="left-3 top-3" label="Property Check" />
        </div>
      </div>
    </div>
  );
}

function WorkflowPanel({
  label,
  src,
}: {
  label: string;
  src: string;
}) {
  return (
    <div className="relative min-h-36 overflow-hidden rounded-lg border border-white/18 bg-gradient-to-br from-navy via-charcoal to-navy shadow-lg shadow-black/25">
      <img alt={`${label} service visual`} className="absolute inset-0 h-full w-full object-cover" src={src} />
      <ImageLabel className="left-3 top-3" label={label} />
    </div>
  );
}

function ImageLabel({ className, label }: { className: string; label: string }) {
  return (
    <span
      className={`absolute rounded-full bg-navy/86 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-white shadow-sm backdrop-blur ${className}`}
    >
      {label}
    </span>
  );
}
