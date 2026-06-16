import { ConsultationScheduler } from "@/components/ConsultationScheduler";

export default async function ScheduleConsultationPage({
  searchParams,
}: {
  searchParams: Promise<{ requestId?: string; request?: string }>;
}) {
  const { requestId: requestIdParam, request } = await searchParams;
  const requestId =
    typeof requestIdParam === "string"
      ? requestIdParam
      : typeof request === "string"
        ? request
        : "";

  return (
    <main>
      <section className="bg-stonewash py-12 md:py-16">
        <div className="mx-auto w-full max-w-[1200px] px-6 md:px-8 lg:px-10">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-accentDark">
            Consultation
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-navy md:text-5xl">
            Schedule Project Consultation
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-charcoal/75">
            Choose an available time for a live Zoom consultation with a Grubel
            Project Manager. We will review your request, property details, and
            next steps.
          </p>
        </div>
      </section>

      <section className="bg-white py-10 md:py-14">
        <div className="mx-auto w-full max-w-[1200px] px-6 md:px-8 lg:px-10">
          <div className="max-w-3xl">
            <ConsultationScheduler requestId={requestId} />
          </div>
        </div>
      </section>
    </main>
  );
}
