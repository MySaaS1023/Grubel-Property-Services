import { PageHero } from "@/components/PageHero";
import { CustomerPortalLookup } from "@/components/CustomerPortalLookup";

export default function CustomerPortalPage() {
  return (
    <>
      <PageHero
        eyebrow="CUSTOMER PORTAL"
        title="Customer Portal"
        description="Enter your quote number to access your project dashboard, service status, schedule, files, and next steps."
      />
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <CustomerPortalLookup />
        </div>
      </section>
    </>
  );
}
