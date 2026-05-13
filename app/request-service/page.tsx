import { RequestServiceForm } from "@/components/RequestServiceForm";

export default function RequestServicePage() {
  return (
    <>
      <section className="bg-stonewash">
        <div className="mx-auto max-w-6xl px-6 pb-10 pt-16 lg:pb-12 lg:pt-20">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-accentDark">
              GET QUOTE
            </p>
            <h1 className="text-4xl font-black leading-tight text-navy sm:text-5xl">
              Request Service
            </h1>
            <p className="mt-5 text-lg leading-8 text-charcoal/75">
              Tell us what your property needs. Our team will review the request
              and follow up with next steps or a quote number.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-stonewash pb-16 pt-6">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-4xl">
          <RequestServiceForm />
          </div>
        </div>
      </section>
    </>
  );
}
