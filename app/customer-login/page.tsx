import { CustomerLoginForm } from "@/components/CustomerLoginForm";

export default function CustomerLoginPage() {
  return (
    <>
      <section className="bg-stonewash">
        <div className="site-container py-16 lg:py-20">
          <div className="mx-auto max-w-xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-accentDark">
              CUSTOMER PORTAL
            </p>
            <h1 className="text-4xl font-black leading-tight text-navy sm:text-5xl">
              Customer Portal
            </h1>
            <p className="mt-5 text-lg leading-8 text-charcoal/75">
              Access your quote, payment details, project updates, and service
              status.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-white py-16">
        <div className="site-container">
          <div className="mx-auto max-w-xl">
            <CustomerLoginForm />
          </div>
        </div>
      </section>
    </>
  );
}
