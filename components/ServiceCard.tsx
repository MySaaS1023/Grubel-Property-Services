import Link from "next/link";

type ServiceCardProps = {
  title: string;
  description: string;
  href?: string;
  linkLabel?: string;
  items?: string[];
  locked?: boolean;
};

export function ServiceCard({
  title,
  description,
  href,
  linkLabel = "Learn More",
  items = [],
  locked = false,
}: ServiceCardProps) {
  const content = (
    <>
      <div className="h-1.5 w-14 rounded-full bg-accent" />
      <h3 className="mt-6 text-xl font-black text-navy">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-charcoal/72">{description}</p>
      {items.length ? (
        <ul className="mt-4 grid gap-1 text-sm font-semibold leading-6 text-charcoal/70">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      <span className="mt-5 inline-flex text-sm font-bold text-accentDark transition group-hover:text-navy">
        {locked ? "Coming Soon" : linkLabel}
      </span>
    </>
  );

  if (locked || !href) {
    return (
      <div className="group block rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        {content}
      </div>
    );
  }

  return (
    <Link
      className="group block rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-accent/50 hover:shadow-soft"
      href={href}
    >
      {content}
    </Link>
  );
}
