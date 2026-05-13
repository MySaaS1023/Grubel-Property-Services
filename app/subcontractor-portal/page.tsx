import { PageHero } from "@/components/PageHero";
import { SubcontractorApplicationForm } from "@/components/SubcontractorApplicationForm";

const requirements = [
  "Valid identification required",
  "Insurance may be required depending on project scope",
  "Background information may be requested",
  "Approval required before accepting or performing work",
  "Unauthorized subcontracting is prohibited",
  "Additional subcontracting without written approval is prohibited",
];

export default function SubcontractorPortalPage() {
  return (
    <>
      <PageHero
        eyebrow="Subcontractors"
        title="Subcontractor Partnership Portal"
        description="Apply to work with Grubel Property Services for approved residential and commercial project opportunities."
      />
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <h2 className="text-3xl font-black text-navy">Requirements</h2>
            <div className="mt-6 grid gap-4">
              {requirements.map((item) => (
                <div className="rounded-lg border border-slate-200 bg-stonewash p-5 font-bold text-charcoal" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black text-navy">Required Information</h2>
            <p className="mt-4 leading-7 text-charcoal/72">
              Submit your contact details, experience, service areas, supporting
              documentation, and availability for review.
            </p>
            <div className="mt-6">
              <SubcontractorApplicationForm applicationType="general" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
