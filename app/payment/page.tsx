import { PageHero } from "@/components/PageHero";
import { PaymentCard } from "@/components/PaymentCard";

const paymentOptions = [
  {
    title: "Inspection Deposit",
    description:
      "Submit a deposit for a scheduled preventative property check or visible condition walkthrough.",
    type: "inspection",
  },
  {
    title: "Repair Deposit",
    description:
      "Submit a deposit for scheduled minor repair, upkeep, or maintenance support.",
    type: "repair",
  },
  {
    title: "Turnover Prep Deposit",
    description:
      "Submit a deposit for scheduled turnover prep and move-in readiness support.",
    type: "turnover-prep",
  },
];

export default function PaymentPage() {
  return (
    <>
      <PageHero
        eyebrow="Payment"
        title="Make a Payment"
        description="Securely submit a service deposit."
      />
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-base leading-7 text-charcoal/75">
              Use the options below to submit a deposit for your scheduled
              service. If you have not received a quote, please request service
              first.
            </p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {paymentOptions.map((option) => (
              <PaymentCard key={option.type} {...option} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
