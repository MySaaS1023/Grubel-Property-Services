import { PageHero } from "@/components/PageHero";
import type { ReactNode } from "react";

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy Policy"
        title="Privacy Policy"
        description="This page explains how Grubel Property Services handles information submitted through this website."
      />
      <LegalContent>
        <h2>Information We Collect</h2>
        <p>
          Grubel Property Services may collect contact details, quote numbers,
          property details, service preferences, access notes, application
          details, uploaded documents, and message content submitted through
          website forms.
        </p>
        <h2>How Information Is Used</h2>
        <p>
          Information is used to review requests, prepare quotes, coordinate
          scheduling, process service payments, evaluate subcontractor
          applications, communicate next steps, and maintain basic business
          records.
        </p>
        <h2>Subcontractor Information</h2>
        <p>
          Subcontractor applicants may be asked to provide identification,
          insurance documents, licenses, certifications, work photos, service
          areas, and background information for review before approval.
        </p>
        <h2>Property and Access Information</h2>
        <p>
          Customers should only submit property access information they are
          authorized to share. Access details may be used to coordinate approved
          walkthroughs, maintenance, repairs, turnover prep, and vendor visits.
        </p>
        <h2>Payment Information</h2>
        <p>
          Online payments are processed through third-party payment providers.
          Grubel Property Services does not store full card numbers on this
          website.
        </p>
        <h2>Contact</h2>
        <p>
          Questions about privacy can be sent through the request form on the
          Contact page.
        </p>
      </LegalContent>
    </>
  );
}

function LegalContent({ children }: { children: ReactNode }) {
  return (
    <section className="bg-white py-14">
      <div className="site-container">
        <div className="mx-auto max-w-4xl space-y-4 leading-7 text-charcoal/75 [&_h2]:pt-4 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-navy">
          {children}
        </div>
      </div>
    </section>
  );
}
