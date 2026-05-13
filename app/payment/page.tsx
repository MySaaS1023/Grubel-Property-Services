import { PageHero } from "@/components/PageHero";
import { QuoteLookup } from "@/components/QuoteLookup";

export default function PaymentPage() {
  return (
    <>
      <PageHero
        eyebrow="Payment"
        title="Customer Portal"
        description="Enter your quote number to view your quote, payment details, and project status."
      />
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <QuoteLookup />
        </div>
      </section>
    </>
  );
}
