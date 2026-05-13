import { RequestServiceForm } from "@/components/RequestServiceForm";

export default function RequestServicePage() {
  return (
    <>
      <section className="bg-stonewash">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-accentDark">
              GET QUOTE
            </p>
            <h1 className="text-4xl font-black leading-tight text-navy sm:text-5xl">
              Request Service
            </h1>
            <p className="mt-5 text-lg leading-8 text-charcoal/75">
              Tell Grubel Property Services what your property needs. Our team
              will review the request and follow up with next steps or a quote
              number.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-stonewash py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="leading-7 text-charcoal/72">
              Use this form for virtual inspection, repair, or turnover prep
              requests. Photos help the team understand the property area before
              preparing next steps.
            </p>
          </div>
          <RequestServiceForm />
        </div>
      </section>
    </>
  );
}
