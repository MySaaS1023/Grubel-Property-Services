import { ContactForm } from "@/components/ContactForm";
import { PageHero } from "@/components/PageHero";

const contactReasons = [
  "General inquiries",
  "Customer support",
  "Project questions",
  "Feedback or reviews",
  "Property concerns",
  "Communication support",
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Contact Grubel Property Services"
        description="Questions, project inquiries, customer support, feedback, or property concerns? Contact our team below."
      />
      <section className="bg-white py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <h2 className="text-3xl font-black text-navy">Business Contact</h2>
            <div className="mt-5 grid gap-3 text-sm font-bold text-charcoal">
              <a className="text-accentDark hover:text-navy" href="tel:+14804207398">
                (480) 420-7398
              </a>
              <a className="text-accentDark hover:text-navy" href="mailto:info@grubelps.com">
                info@grubelps.com
              </a>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black text-navy">How We Can Help</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {contactReasons.map((reason) => (
                <div
                  className="rounded-lg border border-slate-200 bg-stonewash p-4 font-bold text-charcoal"
                  key={reason}
                >
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
            <h2 className="text-3xl font-black text-navy">Send Us a Message</h2>
            <p className="mt-4 leading-7 text-charcoal/72">
              Send questions, project updates, feedback, property concerns, or
              support requests. The Grubel Property Services team will follow up.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
