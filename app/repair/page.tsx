import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";

const tasks = [
  "Minor repairs and punch-list items",
  "General upkeep and maintenance support",
  "Door, hardware, fixture, and surface touch-ups",
  "Rental-ready fixes that do not require a specialty trade",
  "Clear communication when a licensed trade is needed",
];

export default function RepairPage() {
  return (
    <>
      <PageHero
        eyebrow="Repair"
        title="Maintenance and Fix support for small property needs."
        description="Grubel Property Services handles practical minor repairs and upkeep tasks that help keep a property clean, functional, and ready for use."
        primaryCta={{ href: "/contact", label: "Request Repair" }}
      />
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-black text-navy">Repair Scope</h2>
            <p className="mt-4 leading-7 text-charcoal/72">
              The Repair service is focused on minor fixes, everyday upkeep, and
              practical maintenance. Grubel Property Services does not advertise
              major construction, remodeling, electrical, plumbing, or
              structural work.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <div className="rounded-lg border border-slate-200 p-5 font-bold text-charcoal" key={task}>
                {task}
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTASection title="Get minor repairs and upkeep handled with Grubel Property Services." />
    </>
  );
}
