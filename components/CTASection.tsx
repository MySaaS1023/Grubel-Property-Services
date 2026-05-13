import { Button } from "@/components/Button";

type CTASectionProps = {
  title: string;
  description?: string;
  buttonLabel?: string;
  buttonHref?: string;
};

export function CTASection({
  title,
  description,
  buttonLabel = "Request Service",
  buttonHref = "/request-service",
}: CTASectionProps) {
  return (
    <section className="bg-navy">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-12 md:flex-row md:items-center">
        <div>
          <h2 className="max-w-3xl text-3xl font-black leading-tight text-white">
            {title}
          </h2>
          {description ? (
            <p className="mt-3 max-w-2xl text-base leading-7 text-white/75">
              {description}
            </p>
          ) : null}
        </div>
        <Button className="shrink-0" href={buttonHref}>
          {buttonLabel}
        </Button>
      </div>
    </section>
  );
}
