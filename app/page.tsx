import { Button } from "@/components/Button";
import { CTASection } from "@/components/CTASection";
import { ServiceCard } from "@/components/ServiceCard";

const services = [
  {
    title: "Property Maintenance & Repair",
    description:
      "Hands-on maintenance, repairs, and property support for residential, rental, and commercial spaces.",
    href: "/repair",
  },
  {
    title: "Property Preservation",
    description:
      "Vacancy, turnover, and occupancy-readiness support to help keep properties protected and ready.",
    href: "/turnover-prep",
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
          icon="phone"
          label="Consultation"
        />
        <WorkflowPanel
          icon="clipboard"
          label="Property Check"
        />
        <WorkflowPanel
          icon="wrench"
          label="Maintenance"
        />
        <WorkflowPanel
          icon="home"
          label="Preservation"
        />
      </div>

      <div className="relative hidden min-h-[510px] md:block">
        <div className="absolute left-10 right-4 top-14 h-72 overflow-hidden rounded-lg border border-white/18 bg-gradient-to-br from-navy via-charcoal to-navy shadow-2xl shadow-black/35 rotate-[-1.5deg]">
          <GeneratedVisual icon="home" />
          <ImageLabel className="left-4 top-4" label="Preservation" />
        </div>

        <div className="absolute left-0 top-0 h-40 w-64 overflow-hidden rounded-lg border border-white/20 bg-gradient-to-br from-navy via-charcoal to-navy shadow-xl shadow-black/30 rotate-[-4deg]">
          <GeneratedVisual icon="phone" />
          <ImageLabel className="left-3 top-3" label="Consultation" />
        </div>

        <div className="absolute bottom-16 right-0 h-48 w-72 overflow-hidden rounded-lg border border-white/20 bg-gradient-to-br from-navy via-charcoal to-navy shadow-xl shadow-black/35 rotate-[3deg]">
          <GeneratedVisual icon="wrench" />
          <ImageLabel className="left-3 top-3" label="Maintenance" />
        </div>

        <div className="absolute bottom-0 left-6 h-44 w-72 overflow-hidden rounded-lg border border-white/20 bg-gradient-to-br from-navy via-charcoal to-navy shadow-xl shadow-black/35 rotate-[-2deg]">
          <GeneratedVisual icon="clipboard" />
          <ImageLabel className="left-3 top-3" label="Property Check" />
        </div>
      </div>
    </div>
  );
}

function WorkflowPanel({
  icon,
  label,
}: {
  icon: VisualIcon;
  label: string;
}) {
  return (
    <div className="relative min-h-36 overflow-hidden rounded-lg border border-white/18 bg-gradient-to-br from-navy via-charcoal to-navy shadow-lg shadow-black/25">
      <GeneratedVisual icon={icon} />
      <ImageLabel className="left-3 top-3" label={label} />
    </div>
  );
}

type VisualIcon = "phone" | "home" | "wrench" | "clipboard";

function GeneratedVisual({ icon }: { icon: VisualIcon }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_24%,rgba(197,138,75,0.24),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_35%),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:auto,28px_28px,28px_28px]" />
      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border border-accent/20" />
      <div className="absolute -bottom-12 left-8 h-32 w-32 rounded-full border border-white/10" />
      <div className="absolute bottom-5 right-5 text-white/16">
        {icon === "phone" ? <PhoneMark /> : null}
        {icon === "home" ? <HomeMark /> : null}
        {icon === "wrench" ? <WrenchMark /> : null}
        {icon === "clipboard" ? <ClipboardMark /> : null}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-navy/75 to-transparent" />
    </div>
  );
}

function PhoneMark() {
  return (
    <div className="h-24 w-16 rounded-[1.25rem] border-4 border-current p-2">
      <div className="h-full rounded-xl border border-current" />
    </div>
  );
}

function HomeMark() {
  return (
    <div className="relative h-24 w-28">
      <div className="absolute left-3 top-9 h-14 w-20 border-4 border-current" />
      <div className="absolute left-0 top-7 h-16 w-16 rotate-45 border-l-4 border-t-4 border-current" />
      <div className="absolute bottom-0 left-10 h-8 w-5 border-2 border-current" />
    </div>
  );
}

function WrenchMark() {
  return (
    <div className="relative h-24 w-24 rotate-[-35deg]">
      <div className="absolute left-9 top-2 h-16 w-6 rounded-full border-4 border-current" />
      <div className="absolute bottom-1 left-7 h-10 w-10 rounded-full border-4 border-current" />
    </div>
  );
}

function ClipboardMark() {
  return (
    <div className="h-24 w-20 rounded-lg border-4 border-current p-4">
      <div className="mb-3 h-1.5 w-10 rounded bg-current" />
      <div className="mb-3 h-1.5 w-8 rounded bg-current" />
      <div className="h-6 w-8 rotate-[-12deg] border-b-4 border-l-4 border-current" />
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
