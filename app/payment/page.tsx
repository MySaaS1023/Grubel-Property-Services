import { Button } from "@/components/Button";

export default function PaymentPage() {
  return (
    <>
      <section className="bg-stonewash">
        <div className="site-container py-16 lg:py-20">
          <div className="mx-auto max-w-4xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-accentDark">
              PAYMENT
            </p>
            <h1 className="text-4xl font-black leading-tight text-navy sm:text-5xl">
              Customer Portal Access
            </h1>
            <p className="mt-5 text-lg leading-8 text-charcoal/75">
              To view your quote, make a payment, or check project status,
              please access the Customer Portal.
            </p>
            <div className="mt-8">
              <Button href="/customer-login">Go to Customer Portal</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
