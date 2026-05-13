import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";

export default function CancelPage() {
  return (
    <>
      <PageHero
        eyebrow="Payment"
        title="Payment Not Completed"
        description="Your payment was canceled. You can return to the payment page and try again."
      />
      <section className="bg-white py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 sm:flex-row sm:px-6 lg:px-8">
          <Button href="/payment" variant="outline">
            Return to Payment
          </Button>
        </div>
      </section>
    </>
  );
}
