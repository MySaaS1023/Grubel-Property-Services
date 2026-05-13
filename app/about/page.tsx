import { Button } from "@/components/Button";

export default function AboutPage() {
  return (
    <>
      <section className="bg-stonewash">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-accentDark">
              About Grubel Property Services
            </p>
            <h1 className="text-4xl font-black leading-tight text-navy sm:text-5xl">
              About Grubel Property Services
            </h1>
            <p className="mt-5 text-lg leading-8 text-charcoal/75">
              Construction-minded property service support for maintenance,
              repair, turnover preparation, and project coordination.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 className="text-3xl font-black text-navy">Founder Story</h2>
          <div className="space-y-4 leading-7 text-charcoal/75">
            <p>
              Grubel Property Services was started by a founder with years of
              project management and contracting experience, including work
              around overseas military base contracting environments where
              coordination, readiness, and follow-through matter every day.
            </p>
            <p>
              That background created a hands-on understanding of construction,
              maintenance, repair coordination, property readiness, and the
              practical details that keep projects moving. The company was built
              to help local homeowners, landlords, property managers, and
              businesses find reliable support and the right service solutions
              for their properties.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-stonewash py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 className="text-3xl font-black text-navy">Who We Are</h2>
          <div className="space-y-4 leading-7 text-charcoal/75">
            <p>
              Grubel Property Services is a construction-minded property
              services company focused on maintenance support, repair
              coordination, turnover preparation, property readiness, and
              practical project support.
            </p>
            <p>
              The company values clear communication, reliability, practical
              solutions, responsive customer support, and careful property care.
              The goal is to make property service needs easier to understand,
              coordinate, and complete.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 className="text-3xl font-black text-navy">
            Mission Statement & Goals
          </h2>
          <div className="space-y-4 leading-7 text-charcoal/75">
            <p>
              Our mission is to help property owners make informed decisions,
              avoid unnecessary problems, and receive reliable service
              coordination for residential and commercial property needs.
            </p>
            <p>
              Grubel Property Services is committed to building long-term
              community trust, supporting dependable contractor relationships,
              and helping customers keep their properties ready, maintained, and
              cared for.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-navy">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-12 md:flex-row md:items-center">
          <div>
            <h2 className="max-w-3xl text-3xl font-black leading-tight text-white">
              Need reliable property support?
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-white/78">
              Contact Grubel Property Services to discuss your property, repair,
              inspection, or turnover needs.
            </p>
          </div>
          <Button className="shrink-0" href="/contact">
            Contact Us
          </Button>
        </div>
      </section>
    </>
  );
}
