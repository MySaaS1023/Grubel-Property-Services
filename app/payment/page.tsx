import { PageHero } from "@/components/PageHero";
import { PaymentQuoteLookup } from "@/components/PaymentQuoteLookup";

export default function PaymentPage() {
  return (
    <>
      <PageHero
        eyebrow="PAYMENT"
        title="Make a Payment"
        description="Enter your quote number to view your balance and complete payment."
      />
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <PaymentQuoteLookup />
        </div>
      </section>
    </>
  );
}
