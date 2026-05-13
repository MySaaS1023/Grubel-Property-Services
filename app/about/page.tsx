import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";

const approach = [
  "Clear communication",
  "Practical solutions",
  "Property-first mindset",
  "Reliable coordination",
  "Maintenance-focused prevention",
];

const partners = [
  "Homeowners",
  "Landlords",
  "Property managers",
  "Investors",
  "Commercial property owners",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Grubel Property Services"
        title="About Grubel Property Services"
        description="Construction-minded property service support for maintenance, repair, turnover preparation, and project coordination."
      />
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <h2 className="text-3xl font-black text-navy">Who We Are</h2>
          <p className="leading-7 text-charcoal/75">
            Grubel Property Services is a construction-minded property services
            company focused on helping owners maintain, repair, prepare, and
            improve residential and commercial properties through practical
            hands-on support.
          </p>
        </div>
      </section>

      <section className="bg-stonewash py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-3xl font-black text-navy">Our Background</h2>
            <p className="mt-4 leading-7 text-charcoal/75">
              The business is led by an owner with construction and property
              repair experience, bringing real-world understanding of
              maintenance operations, repair coordination, turnover preparation,
              and property readiness.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-black text-navy">How We Work</h2>
            <div className="mt-6 grid gap-4">
              {approach.map((item) => (
                <div className="rounded-lg border border-slate-200 bg-white p-5 font-bold text-charcoal" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <h2 className="text-3xl font-black text-navy">Who We Work With</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {partners.map((item) => (
              <div className="rounded-lg border border-slate-200 p-5 font-bold text-charcoal" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center lg:px-8">
          <h2 className="max-w-3xl text-3xl font-black leading-tight text-white">
            Work With Grubel Property Services
          </h2>
          <Button className="shrink-0" href="/contact">
            Request Service
          </Button>
        </div>
      </section>
    </>
  );
}
