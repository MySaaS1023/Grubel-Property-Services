import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";

const benefits = [
  "Review visible property concerns before scheduling work",
  "Share photos or video for practical feedback",
  "Identify maintenance, turnover, and repair next steps",
];

export default function InspectionPage() {
  return (
    <>
      <PageHero
        eyebrow="Virtual Inspection"
        title="Virtual Inspection"
        description="Virtual property inspections and visible condition walkthroughs designed to help property owners identify maintenance concerns, turnover needs, and repair opportunities before they become larger issues."
        primaryCta={{ href: "/request-service", label: "Request Virtual Inspection" }}
        secondaryCta={{ href: "/services", label: "View Services" }}
      />
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="text-3xl font-black text-navy">How It Helps</h2>
            <p className="mt-4 leading-7 text-charcoal/72">
              A virtual inspection gives owners a practical view of visible
              property condition and helps organize maintenance or repair next
              steps without turning the page into a formal inspection report.
            </p>
          </div>
          <div className="space-y-4">
            {benefits.map((benefit) => (
              <p className="border-l-4 border-accent pl-4 font-bold leading-7 text-charcoal" key={benefit}>
                {benefit}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stonewash py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl leading-7 text-charcoal/75">
            Virtual inspections are visual property condition walkthroughs for
            maintenance and operational support. Grubel Property Services does
            not provide licensed home inspections or engineering reports.
          </p>
          <Button className="shrink-0" href="/request-service">
            Request Virtual Inspection
          </Button>
        </div>
      </section>
    </>
  );
}
