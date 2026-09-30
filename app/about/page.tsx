import { Button } from "@/components/Button";

export default function AboutPage() {
  return (
    <>
      <section className="bg-stonewash">
        <div className="site-container py-16 lg:py-20">
          <div className="mx-auto max-w-4xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-accentDark">
              ABOUT
            </p>
            <h1 className="text-4xl font-black leading-tight text-navy sm:text-5xl">
              Grubel Property Services
            </h1>
            <p className="mt-5 text-lg leading-8 text-charcoal/75">
              Dependable cleaning and property care designed to help homeowners,
              rental properties, and property owners keep their spaces clean,
              cared for, and ready.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="site-container grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 className="text-3xl font-black text-navy">Founder Story</h2>
          <div className="space-y-4 leading-7 text-charcoal/75">
            <p>
              Grubel Property Services was founded with a simple goal: make
              dependable property care easier to access and easier to manage.
            </p>
            <p>
              Built on years of project management and contracting experience,
              Grubel brings organization, communication, and attention to detail
              to every service. We understand that maintaining a property takes
              time, coordination, and people you can rely on.
            </p>
            <p>
              Today, we are beginning with professional cleaning and routine
              property care while building a foundation that allows Grubel
              Property Services to grow alongside the needs of the customers and
              properties we serve.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-stonewash py-16">
        <div className="site-container grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 className="text-3xl font-black text-navy">Who We Are</h2>
          <div className="space-y-4 leading-7 text-charcoal/75">
            <p>
              Grubel Property Services is a property services company focused on
              dependable cleaning and routine property care for homes, rentals,
              and other properties.
            </p>
            <p>
              We believe property services should be straightforward, reliable,
              and easy to coordinate. Our approach combines clear communication,
              organized service management, and dependable professionals to help
              customers take care of their properties with less stress.
            </p>
            <p>
              As Grubel grows, our services may expand, but our focus will remain
              the same: reliable service, clear communication, and property care
              customers can count on.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="site-container grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 className="text-3xl font-black text-navy">
            Mission Statement & Goals
          </h2>
          <div className="space-y-4 leading-7 text-charcoal/75">
            <p>
              Our mission is to provide dependable cleaning and property care
              while making the service experience simple, organized, and reliable
              for our customers.
            </p>
            <p>
              Grubel Property Services is committed to building long-term
              customer relationships, supporting dependable service
              professionals, and creating a trusted property services company
              that can grow with the needs of the communities we serve.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-navy">
        <div className="site-container flex flex-col items-start gap-6 py-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl">
            <h2 className="max-w-3xl text-3xl font-black leading-tight text-white">
              Need dependable cleaning or property care?
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-white/85">
              Tell us what your property needs and let Grubel Property Services
              help take care of the rest.
            </p>
          </div>
          <Button className="shrink-0 md:self-center" href="/request-service">
            Request Service
          </Button>
        </div>
      </section>
    </>
  );
}
