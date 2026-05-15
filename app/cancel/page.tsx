import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";

export default function CancelPage() {
  return (
    <>
      <PageHero
        eyebrow="Payment"
        title="Payment Not Completed"
        description="Your payment was canceled. You can return to the Customer Portal and try again."
      />
      <section className="bg-white py-12">
        <div className="site-container">
          <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row">
            <Button href="/customer-login" variant="outline">
              Go to Customer Portal
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
