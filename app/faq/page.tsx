const sections = [
  {
    title: "General Questions",
    faqs: [
      {
        question: "What services do you provide?",
        answer:
          "Grubel Property Services provides Property Maintenance & Repair and Property Preservation services for residential, rental, and commercial properties.",
      },
      {
        question: "Do you handle commercial properties?",
        answer:
          "Yes. We work with residential and commercial property owners, managers, landlords, and investors.",
      },
      {
        question: "Why choose Grubel Property Services?",
        answer:
          "Grubel Property Services brings a construction-minded, hands-on approach to maintenance, repair coordination, preservation support, and operational property care. The focus is clear communication, practical next steps, reliable service, and helping properties stay in better condition.",
      },
      {
        question: "Who does Grubel Property Services help?",
        answer:
          "We help Homeowners, Landlords, Property managers, Rental owners, investors, and commercial property owners with maintenance, repair coordination, property preservation, occupancy readiness, and project support.",
      },
      {
        question: "How does the customer flow work?",
        answer:
          "Customers can request the service that fits their property, Grubel Property Services reviews the project based on its own needs, and approved quotes can be tracked through the Customer Portal.",
      },
    ],
  },
  {
    title: "Property Maintenance & Repair Questions",
    faqs: [
      {
        question: "What is Property Maintenance & Repair?",
        answer:
          "Property Maintenance & Repair includes hands-on maintenance, repairs, repair coordination, punch-list work, property upkeep, and practical project support for residential, rental, and commercial spaces.",
      },
      {
        question: "What types of repair needs can I request?",
        answer:
          "Customers can request drywall repairs, paint touch-ups, fixture replacement, door adjustments, caulking, sealing, punch-list repairs, maintenance support, repair coordination, and related property upkeep.",
      },
      {
        question: "Do some projects require licensed contractors?",
        answer:
          "Yes. Certain trades or project scopes may require licensed specialty contractors depending on local requirements.",
      },
    ],
  },
  {
    title: "Property Preservation Questions",
    faqs: [
      {
        question: "What is Property Preservation?",
        answer:
          "Property Preservation focuses on vacancy upkeep, move-in and move-out readiness, turnover coordination, trash-out coordination, final walkthrough support, property condition upkeep, vendor coordination, and occupancy-readiness support.",
      },
      {
        question: "Can preservation services be requested independently?",
        answer:
          "Yes. Services can be requested independently, and each project is reviewed based on its own property needs, access, timing, and scope.",
      },
    ],
  },
  {
    title: "Payment Questions",
    faqs: [
      {
        question: "How do quotes work?",
        answer:
          "Customers submit a service request and Grubel Property Services reviews the project details before issuing a quote number when applicable.",
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
          "Yes. Scheduling depends on availability, project scope, property access, materials, vendors, and confirmation.",
      },
      {
        question: "What happens after I submit a request?",
        answer:
          "Grubel Property Services reviews the details, photos, and project description, then follows up with next steps or a quote number.",
      },
      {
        question: "Are virtual reviews still available?",
        answer:
          "Virtual reviews may be used as part of intake, consultation, or project review. They are not presented as a standalone paid inspection service.",
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
      <section className="bg-stonewash">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-accentDark">
              FAQ
            </p>
            <h1 className="text-4xl font-black leading-tight text-navy sm:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-5 text-lg leading-8 text-charcoal/75">
              Answers to common questions about Grubel Property Services,
              scheduling, payments, maintenance, preservation, and subcontractor
              work.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid max-w-4xl gap-10">
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
