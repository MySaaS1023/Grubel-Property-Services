import Link from "next/link";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";

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
      <PageHero
        eyebrow="Services"
        title="Property services built around practical next steps."
        description="Grubel Property Services keeps the process simple: review the property need, request a quote, receive a quote number, then track payment and project status through the customer portal."
      />
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white shadow-sm">
            {services.map((service) => (
              <article className="p-6" key={service.title}>
                <h2 className="text-2xl font-black text-navy">{service.title}</h2>
                <p className="mt-3 leading-7 text-charcoal/72">
                  {service.description}
                </p>
                <Link
                  className="mt-4 inline-flex text-sm font-bold text-accentDark transition hover:text-navy"
                  href={service.href}
                >
                  Learn More
                </Link>
              </article>
            ))}
          </div>
          <div className="mt-8">
            <Button href="/request-service">Get Quote</Button>
          </div>
        </div>
      </section>
    </>
  );
}
