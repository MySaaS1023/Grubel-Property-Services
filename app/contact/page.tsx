import { ContactForm } from "@/components/ContactForm";
import { PageHero } from "@/components/PageHero";

const contactReasons = [
  "Property service requests",
  "Repair questions",
  "Turnover support",
  "Scheduling questions",
  "Subcontractor inquiries",
  "General project coordination",
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Request Service"
        title="Tell Grubel Property Services what your property needs."
        description="Use the form below for preventative checks, minor repair requests, turnover prep, or other property upkeep needs."
      />
      <section className="bg-white py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <h2 className="text-3xl font-black text-navy">Business Contact</h2>
            <div className="mt-5 grid gap-3 text-sm font-bold text-charcoal">
              <a className="text-accentDark hover:text-navy" href="mailto:info@grubelps.com">
                info@grubelps.com
              </a>
              <a className="text-accentDark hover:text-navy" href="tel:+14804207398">
                (480) 420-7398
              </a>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black text-navy">Why Contact Us</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {contactReasons.map((reason) => (
                <div className="rounded-lg border border-slate-200 bg-stonewash p-4 font-bold text-charcoal" key={reason}>
                  {reason}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
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
