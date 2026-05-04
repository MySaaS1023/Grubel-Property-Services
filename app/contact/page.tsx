import { ContactForm } from "@/components/ContactForm";
import { PageHero } from "@/components/PageHero";

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Request Service"
        title="Tell Grubel Property Services what your property needs."
        description="Use the form below for preventative checks, minor repair requests, turnover prep, or other property upkeep needs."
      />
      <section className="bg-stonewash py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
          <div>
            <h2 className="text-3xl font-black text-navy">Contact / Request Service</h2>
            <p className="mt-4 leading-7 text-charcoal/72">
              Share the property address, service needed, preferred timing, and
              a short description. Grubel Property Services will review the
              request and follow up.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
