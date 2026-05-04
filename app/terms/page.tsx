import { PageHero } from "@/components/PageHero";

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Terms"
        title="Terms of Service"
        description="These terms outline the basic website and service request expectations for Grubel Property Services."
      />
      <section className="bg-white py-14">
        <div className="mx-auto max-w-3xl space-y-4 px-4 leading-7 text-charcoal/75 sm:px-6 lg:px-8 [&_h2]:pt-4 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-navy">
          <h2>Service Scope</h2>
          <p>
            Grubel Property Services provides property checks, visible condition
            walkthroughs, maintenance check support, minor repairs, upkeep, and
            turnover prep. Services are subject to availability and
            property-specific review.
          </p>
          <h2>Limitations</h2>
          <p>
            Grubel Property Services does not provide technical inspection
            reports, major construction, remodeling, electrical, plumbing, or
            structural work. A specialty provider may be recommended when a
            request is outside the service scope.
          </p>
          <h2>Requests and Scheduling</h2>
          <p>
            Submitting a request does not guarantee scheduling or pricing.
            Details are reviewed before work is confirmed.
          </p>
        </div>
      </section>
    </>
  );
}
