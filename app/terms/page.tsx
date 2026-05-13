import { PageHero } from "@/components/PageHero";

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Terms"
        title="Terms of Service"
        description="These terms outline website, service request, scheduling, payment, access, and scope expectations for Grubel Property Services."
      />
      <section className="bg-white py-14">
        <div className="mx-auto max-w-3xl space-y-4 px-4 leading-7 text-charcoal/75 sm:px-6 lg:px-8 [&_h2]:pt-4 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-navy">
          <h2>Service Scope</h2>
          <p>
            Grubel Property Services provides property maintenance, visible
            condition walkthroughs, minor repairs, turnover prep, project
            support, and contractor coordination. All work is subject to
            property-specific review, scheduling, access, and written scope.
          </p>
          <h2>Scope-of-Work Clarification</h2>
          <p>
            Any estimate, quote, message, or walkthrough is limited to the work
            specifically described. Additional conditions discovered during work
            may require a revised scope, additional approval, specialty trade
            referral, or separate quote.
          </p>
          <h2>Visual Inspection Limitations</h2>
          <p>
            Virtual inspections and property checks are visual condition
            walkthroughs for maintenance and operational support. They are not
            licensed home inspections, engineering reports, code compliance
            reviews, or guarantees of hidden conditions.
          </p>
          <h2>Scheduling and Property Access</h2>
          <p>
            Scheduling depends on availability, property access, project scope,
            and required materials or vendors. Customers are responsible for
            providing lawful access, accurate property information, and any
            required permissions.
          </p>
          <h2>Payment Expectations</h2>
          <p>
            Deposits, progress payments, or final payments may be required based
            on the approved quote or service scope. Work may be paused or
            rescheduled if payment or approval requirements are not met.
          </p>
          <h2>Contractor Coordination</h2>
          <p>
            When specialty contractors or vendors are involved, Grubel Property
            Services may assist with coordination, documentation, and scheduling.
            Third-party work, licensing, warranties, and performance remain
            subject to the applicable provider.
          </p>
          <h2>Liability Limitations</h2>
          <p>
            Grubel Property Services is not responsible for pre-existing
            conditions, concealed damage, inaccessible areas, inaccurate
            customer-provided information, unauthorized property access, or work
            performed by unapproved third parties.
          </p>
        </div>
      </section>
    </>
  );
}
