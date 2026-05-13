import { PaymentQuoteLookup } from "@/components/PaymentQuoteLookup";

export default function PaymentPage() {
  return (
    <>
      <section className="bg-stonewash">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:py-20">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-accentDark">
              PAYMENT
            </p>
            <h1 className="text-4xl font-black leading-tight text-navy sm:text-5xl">
              Quote, Payment & Project Status
            </h1>
            <p className="mt-5 text-lg leading-8 text-charcoal/75">
              Enter your quote number to view your balance, make a payment, or
              check your project status.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-6">
          <PaymentQuoteLookup />
        </div>
      </section>
    </>
  );
}
