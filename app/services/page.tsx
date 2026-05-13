import Link from "next/link";

const services = [
  {
    title: "Property Maintenance & Repair",
    description:
      "Construction-minded maintenance, repair, and property support services designed to keep residential, rental, and commercial properties functional, maintained, and operational.",
    examples: [
      "Drywall patching and repairs",
      "Paint touch-ups",
      "Fixture replacement",
      "Door adjustments",
      "Caulking and sealing",
      "Punch-list repairs",
      "Property upkeep",
      "Repair coordination",
      "Maintenance support",
      "Project support",
    ],
  },
  {
    title: "Property Preservation",
    description:
      "Property preservation and occupancy-readiness services focused on vacancy upkeep, turnover coordination, ongoing property care, and overall property condition support.",
    examples: [
      "Vacancy checks",
      "Move-in / move-out readiness",
      "Trash-out coordination",
      "Turnover preparation",
      "Final walkthrough support",
      "Property condition upkeep",
      "Lock/change coordination support",
      "Vendor coordination",
      "Preservation documentation",
      "Occupancy readiness support",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="bg-stonewash">
        <div className="mx-auto max-w-6xl px-6 pb-10 pt-16 lg:pb-12 lg:pt-20">
          <div className="max-w-4xl">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-accentDark">
            SERVICES
          </p>
          <h1 className="text-4xl font-black leading-tight text-navy sm:text-5xl">
            Property services built around practical next steps.
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/75">
            Grubel Property Services keeps the process simple: review the
            property need, request a quote, receive a quote number, then track
            payment and project status through the customer portal.
          </p>
          </div>
        </div>
      </section>
      <section className="bg-white pb-16 pt-8">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-4xl">
          <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white shadow-sm">
            {services.map((service) => (
              <article className="p-6" key={service.title}>
                <h2 className="text-2xl font-black text-navy">{service.title}</h2>
                <p className="mt-3 leading-7 text-charcoal/72">
                  {service.description}
                </p>
                <ul className="mt-4 grid gap-2 text-sm font-semibold leading-6 text-charcoal/72 sm:grid-cols-2">
                  {service.examples.map((example) => (
                    <li className="border-l-4 border-accent pl-3" key={example}>
                      {example}
                    </li>
                  ))}
                </ul>
                <Link
                  className="mt-4 inline-flex text-sm font-bold text-accentDark transition hover:text-navy"
                  href="/request-service"
                >
                  Get Quote
                </Link>
              </article>
            ))}
          </div>
          </div>
        </div>
      </section>
    </>
  );
}
