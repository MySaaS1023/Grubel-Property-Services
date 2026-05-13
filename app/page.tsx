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

const heroVisuals = {
  consultation: createMockPhoto("consultation"),
  maintenance: createMockPhoto("maintenance"),
  preservation: createMockPhoto("preservation"),
  propertyCheck: createMockPhoto("propertyCheck"),
};

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
          visual={heroVisuals.consultation}
        />
        <WorkflowPanel
          label="Property Check"
          visual={heroVisuals.propertyCheck}
        />
        <WorkflowPanel
          label="Maintenance"
          visual={heroVisuals.maintenance}
        />
        <WorkflowPanel
          label="Preservation"
          visual={heroVisuals.preservation}
        />
      </div>

      <div className="relative hidden min-h-[510px] md:block">
        <div className="absolute left-10 right-4 top-14 h-72 overflow-hidden rounded-lg border border-white/18 bg-gradient-to-br from-navy via-charcoal to-navy shadow-2xl shadow-black/35 rotate-[-1.5deg]">
          <PanelVisual visual={heroVisuals.preservation} />
          <ImageLabel className="left-4 top-4" label="Preservation" />
        </div>

        <div className="absolute left-0 top-0 h-40 w-64 overflow-hidden rounded-lg border border-white/20 bg-gradient-to-br from-navy via-charcoal to-navy shadow-xl shadow-black/30 rotate-[-4deg]">
          <PanelVisual visual={heroVisuals.consultation} />
          <ImageLabel className="left-3 top-3" label="Consultation" />
        </div>

        <div className="absolute bottom-16 right-0 h-48 w-72 overflow-hidden rounded-lg border border-white/20 bg-gradient-to-br from-navy via-charcoal to-navy shadow-xl shadow-black/35 rotate-[3deg]">
          <PanelVisual visual={heroVisuals.maintenance} />
          <ImageLabel className="left-3 top-3" label="Maintenance" />
        </div>

        <div className="absolute bottom-0 left-6 h-44 w-72 overflow-hidden rounded-lg border border-white/20 bg-gradient-to-br from-navy via-charcoal to-navy shadow-xl shadow-black/35 rotate-[-2deg]">
          <PanelVisual visual={heroVisuals.propertyCheck} />
          <ImageLabel className="left-3 top-3" label="Property Check" />
        </div>
      </div>
    </div>
  );
}

function WorkflowPanel({
  label,
  visual,
}: {
  label: string;
  visual: string;
}) {
  return (
    <div className="relative min-h-36 overflow-hidden rounded-lg border border-white/18 bg-gradient-to-br from-navy via-charcoal to-navy shadow-lg shadow-black/25">
      <PanelVisual visual={visual} />
      <ImageLabel className="left-3 top-3" label={label} />
    </div>
  );
}

function PanelVisual({ visual }: { visual: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(8, 32, 58, 0.02), rgba(8, 32, 58, 0.2)), url("${visual}")`,
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-navy/70 to-transparent" />
    </div>
  );
}

type MockPhotoKind = "consultation" | "maintenance" | "propertyCheck" | "preservation";

function createMockPhoto(kind: MockPhotoKind) {
  const scenes: Record<MockPhotoKind, string> = {
    consultation: `
      <rect width="800" height="520" fill="url(#sky)"/>
      <rect y="250" width="800" height="270" fill="#d7e3dd"/>
      <rect x="70" y="130" width="660" height="270" rx="8" fill="#e9efe9"/>
      <rect x="125" y="180" width="120" height="115" fill="#ffffff" opacity=".85"/>
      <rect x="555" y="180" width="120" height="115" fill="#ffffff" opacity=".85"/>
      <rect x="0" y="360" width="800" height="160" fill="#b7c3b8"/>
      <rect x="260" y="185" width="280" height="150" rx="28" fill="#f8f7f1" stroke="#122a44" stroke-width="12"/>
      <rect x="300" y="214" width="200" height="92" rx="8" fill="#c8d3c9"/>
      <path d="M335 278 L397 228 L474 292" fill="none" stroke="#1f3b57" stroke-width="9" stroke-linecap="round"/>
      <circle cx="626" cy="392" r="70" fill="#f0d8bf"/>
      <circle cx="205" cy="392" r="70" fill="#f0d8bf"/>
    `,
    maintenance: `
      <rect width="800" height="520" fill="#eee4d8"/>
      <rect y="370" width="800" height="150" fill="#b9aea1"/>
      <rect x="0" y="338" width="800" height="24" fill="#ffffff"/>
      <rect x="515" y="55" width="150" height="160" fill="#ffffff"/>
      <rect x="535" y="75" width="110" height="118" fill="#d8e7ec"/>
      <rect x="312" y="150" width="95" height="165" rx="28" fill="#c9a17a"/>
      <rect x="265" y="220" width="160" height="120" rx="18" fill="#d4e44d"/>
      <path d="M296 232 L390 332 M405 230 L286 335" stroke="#879252" stroke-width="12"/>
      <rect x="325" y="125" width="95" height="38" rx="18" fill="#d78a24"/>
      <path d="M415 300 C500 300 530 330 580 382" stroke="#30455b" stroke-width="14" fill="none"/>
      <rect x="615" y="330" width="24" height="75" rx="7" fill="#7c604d"/>
      <circle cx="620" cy="325" r="18" fill="#9c7b62"/>
    `,
    propertyCheck: `
      <rect width="800" height="520" fill="#dec49b"/>
      <rect y="340" width="800" height="180" fill="#c3a172"/>
      <g stroke="#b38858" stroke-width="12">
        <path d="M0 90 H800"/><path d="M0 160 H800"/><path d="M0 230 H800"/><path d="M0 300 H800"/>
      </g>
      <rect x="380" y="120" width="150" height="180" fill="#f2efe7"/>
      <rect x="410" y="150" width="90" height="115" fill="#c9d7d7"/>
      <rect x="585" y="260" width="92" height="125" rx="20" fill="#b98b66"/>
      <circle cx="632" cy="225" r="42" fill="#f1c8a4"/>
      <rect x="590" y="182" width="94" height="32" rx="16" fill="#d85836"/>
      <path d="M255 285 C330 290 375 315 410 365" stroke="#38516a" stroke-width="13" fill="none"/>
      <rect x="225" y="330" width="135" height="42" rx="8" fill="#f8f4e8" stroke="#5f4636" stroke-width="7"/>
    `,
    preservation: `
      <rect width="800" height="520" fill="#d9bf88"/>
      <rect y="360" width="800" height="160" fill="#b8833c"/>
      <path d="M0 385 H800 M0 420 H800 M0 455 H800 M0 490 H800" stroke="#d5a65f" stroke-width="4"/>
      <rect x="375" y="108" width="120" height="180" fill="#f7f1df"/>
      <rect x="520" y="108" width="120" height="180" fill="#f7f1df"/>
      <rect x="398" y="134" width="75" height="118" fill="#e5f0ee"/>
      <rect x="543" y="134" width="75" height="118" fill="#e5f0ee"/>
      <rect x="85" y="95" width="145" height="250" fill="#e8d5aa"/>
      <rect x="610" y="330" width="88" height="72" fill="#8f642e"/>
      <rect x="535" y="368" width="92" height="70" fill="#a06d32"/>
      <rect x="660" y="402" width="74" height="62" fill="#7d5729"/>
      <circle cx="705" cy="315" r="46" fill="#527342"/>
      <rect x="698" y="342" width="14" height="72" fill="#6b4a2b"/>
    `,
  };

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520"><defs><linearGradient id="sky" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#dfe9ec"/><stop offset="1" stop-color="#9fb2b6"/></linearGradient></defs>${scenes[kind]}<rect width="800" height="520" fill="url(#grain)" opacity=".08"/><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2"/></filter><rect width="800" height="520" filter="url(#noise)" opacity=".08"/></svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
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
