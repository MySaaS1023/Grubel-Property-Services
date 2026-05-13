import Link from "next/link";

const services = [
  {
    title: "Virtual Inspection",
    href: "/inspection",
    description:
      "Visual property condition walkthroughs for owners who need practical maintenance awareness before approving next steps.",
  },
  {
    title: "Repair",
    href: "/repair",
    description:
      "Maintenance and repair support for punch-list items, property upkeep, and repair coordination.",
  },
  {
    title: "Turnover Prep",
    href: "/turnover-prep",
    description:
      "Readiness support between occupants, including turnover observations, repair coordination, and final preparation.",
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
