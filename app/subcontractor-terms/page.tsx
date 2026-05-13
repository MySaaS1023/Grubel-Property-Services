import { PageHero } from "@/components/PageHero";

export default function SubcontractorTermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Subcontractors"
        title="Subcontractor Terms"
        description="Baseline expectations for subcontractors applying to work with Grubel Property Services."
      />
      <section className="bg-white py-14">
        <div className="mx-auto max-w-3xl space-y-4 px-4 leading-7 text-charcoal/75 sm:px-6 lg:px-8 [&_h2]:pt-4 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-navy">
          <h2>Independent Contractor Relationship</h2>
          <p>
            Subcontractors are independent contractors and are not employees,
            agents, partners, or representatives of Grubel Property Services
            unless a separate written agreement says otherwise.
          </p>
          <h2>No Guaranteed Work</h2>
          <p>
            Application, approval, or prior project participation does not
            guarantee work volume, assignments, payment terms, or future project
            opportunities.
          </p>
          <h2>No Unauthorized Subcontracting</h2>
          <p>
            Subcontractors may not subcontract assigned work, bring additional
            workers, or delegate project responsibilities without written
            approval from Grubel Property Services.
          </p>
          <h2>No Unauthorized Representation</h2>
          <p>
            Subcontractors may not represent themselves as employees,
            authorized agents, or decision-makers for Grubel Property Services
            without written authorization.
          </p>
          <h2>Insurance and Documentation</h2>
          <p>
            Insurance, licenses, certifications, identification, and supporting
            documents may be required depending on project scope, trade, property
            requirements, and local laws.
          </p>
          <h2>Compliance and Safety</h2>
          <p>
            Subcontractors are responsible for complying with local laws,
            permitting requirements, safety requirements, jobsite rules, and
            applicable trade standards.
          </p>
          <h2>Quality and Property Damage</h2>
          <p>
            Work must be completed professionally, safely, and consistent with
            the approved scope. Subcontractors may be responsible for damage,
            rework, cleanup, or costs caused by negligent, unauthorized, unsafe,
            or incomplete work.
          </p>
          <h2>Confidentiality</h2>
          <p>
            Customer information, property access details, project documents,
            pricing, photos, and internal communications should be treated as
            confidential unless disclosure is authorized.
          </p>
        </div>
      </section>
    </>
  );
}
