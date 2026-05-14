import { PageHero } from "@/components/PageHero";

export default function DisclaimerPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Disclaimer"
        description="Important service limitations and general information for Grubel Property Services."
      />

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 text-charcoal/76">
          <div>
            <h2 className="text-2xl font-black text-navy">General Information</h2>
            <p className="mt-3 leading-7">
              Information on this website is provided for general business and
              service information only. It does not create a guarantee,
              warranty, or binding scope of work until Grubel Property Services
              reviews the project details and confirms the requested service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-navy">Service Limitations</h2>
            <p className="mt-3 leading-7">
                Virtual reviews and property checks are visible condition
                walkthroughs intended for maintenance and operational support.
                Grubel Property Services does not provide licensed home
                inspection services, engineering reports, structural
                evaluations, or specialty trade certifications.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-navy">Project Scope</h2>
            <p className="mt-3 leading-7">
              Some repair, construction, electrical, plumbing, structural, or
              specialty work may require licensed contractors or third-party
              vendors depending on project scope and local requirements.
              Pricing, scheduling, access requirements, and service availability
              are confirmed after review.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
