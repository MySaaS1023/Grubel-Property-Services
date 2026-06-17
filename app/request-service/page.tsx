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
              Tell us about your project and upload any photos or videos you
              would like us to review. Once submitted, you&apos;ll be able to
              schedule a consultation with one of our Project Managers.
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
