import { ContactForm } from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <>
      <section className="bg-stonewash">
        <div className="mx-auto max-w-4xl px-6 py-16 lg:py-20">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-accentDark">
            Contact
          </p>
          <h1 className="text-4xl font-black leading-tight text-navy sm:text-5xl">
            Contact Grubel Property Services
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/75">
            Questions, project inquiries, customer support, feedback, or
            property concerns? Contact our team below.
          </p>
          <div className="mt-6 grid gap-2 text-sm font-bold text-charcoal sm:grid-cols-2">
            <p>
              Phone:{" "}
              <a className="text-accentDark hover:text-navy" href="tel:4804207398">
                (480) 420-7398
              </a>
            </p>
            <p>
              Email:{" "}
              <a className="text-accentDark hover:text-navy" href="mailto:info@grubelps.com">
                info@grubelps.com
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-6">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
