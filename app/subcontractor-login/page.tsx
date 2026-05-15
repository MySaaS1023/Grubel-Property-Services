import { Suspense } from "react";
import { SubcontractorLoginForm } from "@/components/SubcontractorLoginForm";

export default function SubcontractorLoginPage() {
  return (
    <>
      <section className="bg-stonewash">
        <div className="site-container py-16 lg:py-20">
          <div className="mx-auto max-w-3xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-accentDark">
              SUBCONTRACTOR PORTAL
            </p>
            <h1 className="text-4xl font-black leading-tight text-navy sm:text-5xl">
              Subcontractor Portal
            </h1>
            <p className="mt-5 text-lg leading-8 text-charcoal/75">
              Approved subcontractors can view assignments, upload documents,
              and submit project updates.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-white py-16">
        <div className="site-container">
          <div className="max-w-xl">
            <Suspense>
              <SubcontractorLoginForm />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
