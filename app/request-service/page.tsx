import { PageHero } from "@/components/PageHero";
import { RequestServiceForm } from "@/components/RequestServiceForm";

export default function RequestServicePage() {
  return (
    <>
      <PageHero
        eyebrow="Get Quote"
        title="Request Service"
        description="Tell Grubel Property Services what your property needs. Our team will review the request and follow up with next steps or a quote number."
      />
      <section className="bg-stonewash py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
          <div>
            <h2 className="text-3xl font-black text-navy">Get Quote</h2>
            <p className="mt-4 leading-7 text-charcoal/72">
              Use this form for Virtual Inspection, Repair, and Turnover Prep
              requests. Photos help the team understand the project area before
              preparing next steps.
            </p>
          </div>
          <RequestServiceForm />
        </div>
      </section>
    </>
  );
}
