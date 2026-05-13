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
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 sm:flex-row">
          <Button href="/payment" variant="outline">
            Return to Payment
          </Button>
        </div>
      </section>
    </>
  );
}
