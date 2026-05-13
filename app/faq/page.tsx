import { PageHero } from "@/components/PageHero";

const sections = [
  {
    title: "General Services",
    faqs: [
      {
        question: "What services do you provide?",
        answer:
          "Grubel Property Services provides virtual inspections, repair coordination, maintenance support, turnover preparation, and property service support for residential and commercial properties.",
      },
      {
        question: "Do you provide licensed home inspections?",
        answer:
          "No. Our virtual inspections are visual condition walkthroughs intended for maintenance and operational support purposes only.",
      },
      {
        question: "Do you handle commercial properties?",
        answer:
          "Yes. We work with residential and commercial property owners, managers, landlords, and investors.",
      },
    ],
  },
  {
    title: "Repairs & Maintenance",
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
    title: "Payments & Quotes",
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
    title: "Subcontractors",
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
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:px-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-3xl font-black text-navy">{section.title}</h2>
              <div className="mt-6 grid gap-4">
                {section.faqs.map((faq) => (
                  <article
                    className="rounded-lg border border-slate-200 bg-stonewash p-6 shadow-sm"
                    key={faq.question}
                  >
                    <h3 className="text-lg font-black text-navy">
                      {faq.question}
                    </h3>
                    <p className="mt-3 leading-7 text-charcoal/75">{faq.answer}</p>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
