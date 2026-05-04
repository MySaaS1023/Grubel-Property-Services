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
          Grubel Property Services may collect contact details, property
          details, service preferences, and message content submitted through the
          request form.
        </p>
        <h2>How Information Is Used</h2>
        <p>
          Information is used to review requests, communicate about service
          needs, schedule work, and maintain basic business records.
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
      <div className="mx-auto max-w-3xl space-y-4 px-4 leading-7 text-charcoal/75 sm:px-6 lg:px-8 [&_h2]:pt-4 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-navy">
        {children}
      </div>
    </section>
  );
}
