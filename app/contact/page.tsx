import { ContactForm } from "@/components/ContactForm";
import { PageHero } from "@/components/PageHero";

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Contact Grubel Property Services"
        description="Questions, project inquiries, customer support, feedback, or property concerns? Contact our team below."
      />
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <h2 className="text-3xl font-black text-navy">Business Contact</h2>
            <div className="mt-6 grid gap-5 text-sm font-bold text-charcoal">
              <div>
                <div className="text-xs uppercase tracking-[0.16em] text-charcoal/50">
                  Phone
                </div>
                <a className="mt-2 inline-block text-accentDark hover:text-navy" href="tel:4804207398">
                  (480) 420-7398
                </a>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.16em] text-charcoal/50">
                  Email
                </div>
                <a className="mt-2 inline-block text-accentDark hover:text-navy" href="mailto:info@grubelps.com">
                  info@grubelps.com
                </a>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black text-navy">Send Us a Message</h2>
            <p className="mt-4 leading-7 text-charcoal/72">
              Send questions, project updates, feedback, property concerns, or
              support requests. The Grubel Property Services team will follow up.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
