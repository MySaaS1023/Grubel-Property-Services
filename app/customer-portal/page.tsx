import { PageHero } from "@/components/PageHero";
import { QuoteLookup } from "@/components/QuoteLookup";

export default function CustomerPortalPage() {
  return (
    <>
      <PageHero
        eyebrow="Customer Portal"
        title="Customer Portal"
        description="Enter your quote number to access your project dashboard, payment status, schedule, files, and next steps."
      />
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <QuoteLookup />
        </div>
      </section>
    </>
  );
}
