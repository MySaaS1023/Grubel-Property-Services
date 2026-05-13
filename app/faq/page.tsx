import { PageHero } from "@/components/PageHero";

const sections = [
  {
    title: "General Questions",
    faqs: [
      {
        question: "What services do you provide?",
        answer:
          "Grubel Property Services provides virtual inspections, repair coordination, maintenance support, turnover preparation, and property service support for residential and commercial properties.",
      },
      {
        question: "Do you handle commercial properties?",
        answer:
          "Yes. We work with residential and commercial property owners, managers, landlords, and investors.",
      },
      {
        question: "Why choose Grubel Property Services?",
        answer:
          "Grubel Property Services brings a construction-minded, hands-on approach to property maintenance, repair coordination, turnover prep, and operational support. The focus is clear communication, practical next steps, reliable service, and helping properties stay in better condition.",
      },
      {
        question: "Who does Grubel Property Services help?",
        answer:
          "We help Homeowners, Landlords, Property managers, Rental owners, investors, and commercial property owners with maintenance, property checks, repair coordination, turnover prep, and project support.",
      },
      {
        question: "How does the customer flow work?",
        answer:
          "Start with Services, request a quote through the Request Service form, receive a quote number, then use the Customer Portal for payment and project tracking.",
      },
    ],
  },
  {
    title: "Virtual Inspection Questions",
    faqs: [
      {
        question: "Do you provide licensed home inspections?",
        answer:
          "No. Our virtual inspections are visual condition walkthroughs intended for maintenance and operational support purposes only.",
      },
      {
        question: "Who benefits from a virtual inspection?",
        answer:
          "Virtual inspections can help out-of-state owners, landlords, property managers, rental property owners, and investors understand visible maintenance or turnover concerns.",
      },
      {
        question: "What can I upload for review?",
        answer:
          "You can upload photos or documents with the request form. Clear images of the property, repair area, damage, or turnover concerns are helpful.",
      },
    ],
  },
  {
    title: "Repair Questions",
    faqs: [
      {
        question: "What types of repairs do you handle?",
        answer:
          "We assist with maintenance services, repair coordination, turnover repairs, property upkeep, and general repair support depending on project scope.",
      },
      {
        question: "Do some projects require licensed contractors?",
        answer:
          "Yes. Certain trades or project scopes may require licensed specialty contractors depending on local requirements.",
      },
    ],
  },
  {
    title: "Payment Questions",
    faqs: [
      {
        question: "How do quotes work?",
        answer:
          "Customers submit a service request and Grubel Property Services reviews the project details before issuing a quote number.",
      },
      {
        question: "How do I make a payment?",
        answer:
          "Use the Customer Portal to enter your quote number, view your quote details, and proceed with payment if applicable.",
      },
      {
        question: "Can I check my project status online?",
        answer:
          "Yes. Customers can use their quote number in the Customer Portal to view service status updates.",
      },
    ],
  },
  {
    title: "Scheduling Questions",
    faqs: [
      {
        question: "Can I request a preferred date?",
        answer:
          "Yes. The Request Service form includes a preferred inspection date field. Scheduling depends on availability, project scope, access, and confirmation.",
      },
      {
        question: "What happens after I submit a request?",
        answer:
          "Grubel Property Services reviews the details, photos, and project description, then follows up with next steps or a quote number.",
      },
    ],
  },
  {
    title: "Subcontractor Questions",
    faqs: [
      {
        question: "How do I apply to work with Grubel Property Services?",
        answer:
          "Use the Work With Us section in the footer to apply for handyman, residential, or commercial subcontractor opportunities.",
      },
      {
        question: "What does independent contractor relationship mean?",
        answer:
          "Approved subcontractors operate as independent contractors and are responsible for maintaining any required licensing, insurance, and compliance related to their services.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        description="Answers to common questions about Grubel Property Services, scheduling, payments, repairs, inspections, and subcontractor work."
      />
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-2xl font-black text-navy">{section.title}</h2>
                <div className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
                  {section.faqs.map((faq) => (
                    <details className="group py-4" key={faq.question}>
                      <summary className="cursor-pointer list-none text-base font-black text-charcoal transition hover:text-accentDark">
                        <span className="inline-flex w-full items-center justify-between gap-4">
                          {faq.question}
                          <span className="text-accentDark group-open:rotate-45">+</span>
                        </span>
                      </summary>
                      <p className="mt-3 leading-7 text-charcoal/72">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
