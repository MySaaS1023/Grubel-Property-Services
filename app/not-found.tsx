import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <section className="bg-stonewash py-20 sm:py-28">
      <div className="site-container">
        <div className="mx-auto max-w-2xl rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-accentDark">
            404
          </p>
          <h1 className="mt-3 text-4xl font-black text-navy sm:text-5xl">
            Page Not Found
          </h1>
          <p className="mt-5 text-base font-semibold leading-8 text-charcoal/70">
            The page you are looking for is not available. Return to Grubel
            Property Services or contact the team for help.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button href="/">Go Home</Button>
            <Button href="/contact" variant="secondary">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
