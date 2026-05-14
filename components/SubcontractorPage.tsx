import { PageHero } from "@/components/PageHero";
import { SubcontractorApplicationForm } from "@/components/SubcontractorApplicationForm";

type ApplicationType = "handyman" | "residential" | "commercial";

type FieldConfig = {
  label: string;
  name: string;
  required?: boolean;
  type?: "text" | "email" | "tel" | "textarea" | "file";
};

type SubcontractorPageProps = {
  applicationType: ApplicationType;
  title: string;
  description: string;
  fields: FieldConfig[];
};

const noticeItems = [
  "Approval required before performing work",
  "No unauthorized subcontracting",
  "Approved subcontractors operate as independent contractors and are responsible for maintaining any required licensing, insurance, and compliance related to their services.",
  "Work must meet company standards",
  "Additional documentation may be required",
  "Insurance may be required depending on project scope",
];

export function SubcontractorPage({
  applicationType,
  title,
  description,
  fields,
}: SubcontractorPageProps) {
  return (
    <>
      <PageHero eyebrow="Work With Us" title={title} description={description} />
      <section className="bg-white py-16">
        <div className="site-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-3xl font-black text-navy">Important Notice</h2>
            <div className="mt-6 grid gap-4">
              {noticeItems.map((item) => (
                <div
                  className="rounded-lg border border-slate-200 bg-stonewash p-5 font-bold text-charcoal"
                  key={item}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black text-navy">Application</h2>
            <p className="mt-4 leading-7 text-charcoal/72">
              Complete the form below for review. Submission does not guarantee
              approval or project assignment.
            </p>
            <div className="mt-6">
              <SubcontractorApplicationForm
                applicationType={applicationType}
                fields={fields}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
