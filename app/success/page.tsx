import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";

export default function SuccessPage() {
  return (
    <>
      <PageHero
        eyebrow="Payment"
        title="Payment Received"
        description="Thank you. Your payment has been received. Grubel Property Services will contact you with next steps."
      />
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Button href="/payment">View Quote Status</Button>
        </div>
      </section>
    </>
  );
}
