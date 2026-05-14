import { CustomerPortalDashboard } from "@/components/CustomerPortalDashboard";

type CustomerPortalPageProps = {
  searchParams: Promise<{
    quote?: string;
  }>;
};

export default async function CustomerPortalPage({
  searchParams,
}: CustomerPortalPageProps) {
  const { quote = "" } = await searchParams;

  return (
    <>
      <section className="bg-stonewash">
        <div className="site-container py-16 lg:py-20">
          <div className="mx-auto max-w-5xl">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-accentDark">
              CUSTOMER PORTAL
            </p>
            <h1 className="text-4xl font-black leading-tight text-navy sm:text-5xl">
              Customer Dashboard
            </h1>
            <p className="mt-5 text-lg leading-8 text-charcoal/75">
              View your quote, payment details, project updates, uploaded files,
              and next steps.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-white py-16">
        <div className="site-container">
          <div className="mx-auto max-w-5xl">
            <CustomerPortalDashboard quoteNumber={quote} />
          </div>
        </div>
      </section>
    </>
  );
}
