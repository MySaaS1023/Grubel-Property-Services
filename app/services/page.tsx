import Link from "next/link";
import { Button } from "@/components/Button";

const services = [
  {
    title: "Maintenance & Repair",
    description:
      "Maintenance, repair, and property support for punch-list items, upkeep, service issues, and repair coordination.",
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
    href: "/repair",
  },
  {
    title: "Property Preservation",
    description:
      "Property preservation support for vacancy upkeep, turnover readiness, occupancy preparation, and overall property condition.",
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
    href: "/turnover-prep",
  },
  {
    title: "Builds & Remodels",
    description:
      "Construction-minded improvement, renovation, and remodeling support for residential, rental, and commercial properties.",
    examples: [
      "Kitchen updates",
      "Bathroom remodels",
      "Flooring installation",
      "Property upgrades",
      "Tenant improvements",
      "Renovation support",
      "Trim/cabinet upgrades",
      "Drywall and paint improvements",
      "Exterior upgrades",
      "Commercial improvements",
    ],
    href: "/builds-remodels",
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="bg-stonewash">
        <div className="site-container pb-10 pt-16 lg:pb-12 lg:pt-20">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-accentDark">
              SERVICES
            </p>
            <h1 className="text-4xl font-black leading-tight text-navy sm:text-5xl">
              Property services built around practical next steps.
            </h1>
            <p className="mt-5 text-lg leading-8 text-charcoal/75">
              Grubel Property Services provides construction-minded service
              divisions for maintenance, preservation, and property improvement
              needs. Each service can be requested independently based on what
              your property needs now.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-white pb-16 pt-8">
        <div className="site-container">
          <div className="max-w-4xl">
            <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white shadow-sm">
              {services.map((service) => (
                <article className="p-6" key={service.title}>
                  <h2 className="text-2xl font-black text-navy">
                    {service.title}
                  </h2>
                  <p className="mt-3 leading-7 text-charcoal/72">
                    {service.description}
                  </p>
                  <ul className="mt-4 grid gap-2 text-sm font-semibold leading-6 text-charcoal/72 sm:grid-cols-2">
                    {service.examples.map((example) => (
                      <li
                        className="border-l-4 border-accent pl-3"
                        key={example}
                      >
                        {example}
                      </li>
                    ))}
                  </ul>
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
              <Button href="/request-service">Request Service</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
