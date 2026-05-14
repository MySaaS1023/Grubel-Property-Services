import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";

const services = [
  "Minor repairs",
  "Maintenance punch lists",
  "Fixture replacement",
  "Door and trim adjustments",
  "Caulking and sealing",
  "Property upkeep support",
];

export default function HandyManPage() {
  return (
    <>
      <PageHero
        eyebrow="Work With Us"
        title="Handy Man Services"
        description="Hands-on maintenance and minor repair support for property owners who need practical work completed with clear communication."
        primaryCta={{ href: "/request-service", label: "Request Service" }}
      />
      <section className="bg-white py-16">
        <div className="site-container grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((item) => (
            <div className="rounded-lg border border-slate-200 bg-stonewash p-5 font-bold text-charcoal" key={item}>
              {item}
            </div>
          ))}
        </div>
      </section>
      <CTASection title="Need hands-on property maintenance support?" />
    </>
  );
}
