import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";

const services = ["Inspection", "Repair", "Turnover Prep"];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Grubel Property Services"
        title="About Grubel Property Services"
        description="Reliable property maintenance, preventative inspections, and repair support."
      />
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <h2 className="text-3xl font-black text-navy">Who We Are</h2>
          </div>
          <div className="space-y-5 leading-7 text-charcoal/75">
            <p>
              Grubel Property Services is a family-led property service business
              focused on helping homeowners, landlords, and property owners keep
              their properties in good condition through practical maintenance,
              repair, and turnover support.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-stonewash py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-navy">What We Do</h2>
            <p className="leading-7 text-charcoal/75">
              We provide preventative property checks, minor repair support, and
              turnover prep services designed to help catch issues early and keep
              properties ready for the next occupant.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-navy">Our Approach</h2>
            <p className="leading-7 text-charcoal/75">
              We believe small issues should be handled before they become
              costly problems. Our work is built around clear communication,
              reliable service, and hands-on property care.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-navy">Services</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {services.map((service) => (
              <div
                className="rounded-lg border border-slate-200 p-6 text-lg font-black text-charcoal"
                key={service}
              >
                {service}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center lg:px-8">
          <h2 className="max-w-3xl text-3xl font-black leading-tight text-white">
            Need help keeping your property in shape?
          </h2>
          <Button className="shrink-0" href="/contact">
            Request Service
          </Button>
        </div>
      </section>
    </>
  );
}
