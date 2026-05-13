import { Button } from "@/components/Button";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  primaryCta?: {
    href: string;
    label: string;
  };
  secondaryCta?: {
    href: string;
    label: string;
  };
};

export function PageHero({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
}: PageHeroProps) {
  return (
    <section className="bg-stonewash">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-accentDark">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-4xl font-black leading-tight text-navy sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/75">{description}</p>
          {(primaryCta || secondaryCta) && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {primaryCta ? <Button href={primaryCta.href}>{primaryCta.label}</Button> : null}
              {secondaryCta ? (
                <Button href={secondaryCta.href} variant="outline">
                  {secondaryCta.label}
                </Button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
