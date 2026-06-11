import { RequestServiceForm } from "@/components/RequestServiceForm";

export default function RequestServicePage() {
  return (
    <>
      <section className="bg-stonewash">
        <div className="site-container pb-10 pt-16 lg:pb-12 lg:pt-20">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl font-black leading-tight text-navy sm:text-5xl">
              Start a Project Request
            </h1>
            <p className="mt-5 text-lg leading-8 text-charcoal/75">
              Tell us what your property needs. Our team will review your
              request, collect walkthrough details or media, and follow up with
              next steps.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-stonewash pb-16 pt-6">
        <div className="site-container">
          <div className="mx-auto max-w-4xl">
            <RequestServiceForm />
          </div>
        </div>
      </section>
    </>
  );
}
