import { PageHero } from "@/components/PageHero";

export default function SubcontractorAgreementNoticePage() {
  return (
    <>
      <PageHero
        eyebrow="Subcontractors"
        title="Subcontractor Agreement Notice"
        description="Important notice for applicants and approved subcontractors before accepting work."
      />
      <section className="bg-white py-14">
        <div className="site-container">
        <div className="mx-auto max-w-4xl space-y-4 leading-7 text-charcoal/75 [&_h2]:pt-4 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-navy">
          <h2>Approval Required</h2>
          <p>
            No subcontractor may accept, begin, perform, assign, or represent
            work for Grubel Property Services until written approval and project
            authorization have been provided.
          </p>
          <h2>Written Scope Required</h2>
          <p>
            Work must follow the approved scope, schedule, property access
            instructions, documentation requirements, and communication process.
            Changes require written approval before proceeding.
          </p>
          <h2>No Additional Subcontracting</h2>
          <p>
            Additional subcontracting, helper labor, crew changes, or delegation
            of work is prohibited without written approval.
          </p>
          <h2>Insurance Responsibility</h2>
          <p>
            Subcontractors are responsible for maintaining required insurance,
            licenses, certifications, tools, vehicles, safety equipment, and
            legal compliance for their work.
          </p>
          <h2>Documentation Requirements</h2>
          <p>
            Grubel Property Services may require photos, completion notes,
            invoices, receipts, proof of materials, identification, insurance
            documents, or other records before payment or continued approval.
          </p>
          <h2>Work Quality and Safety</h2>
          <p>
            Subcontractors are expected to protect the property, follow safety
            practices, communicate issues promptly, and correct work quality
            concerns tied to their performance.
          </p>
          <h2>No Company Representation</h2>
          <p>
            Subcontractors may not bind, quote, approve, advertise, or speak on
            behalf of Grubel Property Services unless specifically authorized in
            writing.
          </p>
        </div>
        </div>
      </section>
    </>
  );
}
