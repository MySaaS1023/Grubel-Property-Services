import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/Button";

const serviceItems = [
  { href: "/inspection", label: "Virtual Inspection" },
  { href: "/repair", label: "Repair" },
  { href: "/turnover-prep", label: "Turnover Prep" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:gap-6 sm:px-6 lg:gap-8 lg:px-8">
        <Link className="flex min-w-0 shrink-0 items-center" href="/">
          <Image
            alt="Grubel Property Services Logo"
            className="h-auto w-[118px] min-[380px]:w-[136px] sm:w-[150px] lg:w-[160px]"
            height={60}
            priority
            src="/logo.png"
            width={160}
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          <div className="group relative">
            <Link
              className="text-sm font-semibold text-charcoal/80 transition hover:text-accentDark"
              href="/services"
            >
              Services
            </Link>
            <div className="invisible absolute left-0 top-full z-20 w-52 translate-y-2 rounded-lg border border-slate-200 bg-white p-2 opacity-0 shadow-soft transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              {serviceItems.map((item) => (
                <Link
                  className="block rounded-md px-3 py-2 text-sm font-semibold text-charcoal/80 transition hover:bg-stonewash hover:text-accentDark"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <Link
            className="text-sm font-semibold text-charcoal/80 transition hover:text-accentDark"
            href="/about"
          >
            About
          </Link>
          <Link
            className="text-sm font-semibold text-charcoal/80 transition hover:text-accentDark"
            href="/payment"
          >
            Payment
          </Link>
          <Link
            className="text-sm font-semibold text-charcoal/80 transition hover:text-accentDark"
            href="/faq"
          >
            FAQ
          </Link>
        </nav>

        <Button className="shrink-0 px-3 text-xs sm:px-5 sm:text-sm" href="/contact">
          Request Service
        </Button>
      </div>

      <nav
        className="flex gap-4 overflow-x-auto border-t border-slate-100 px-4 py-3 text-sm font-semibold text-charcoal/75 lg:hidden"
        aria-label="Mobile navigation"
      >
        <details className="group shrink-0">
          <summary className="cursor-pointer list-none transition hover:text-accentDark">
            Services
          </summary>
          <div className="absolute left-4 right-4 z-20 mt-3 grid gap-1 rounded-lg border border-slate-200 bg-white p-2 shadow-soft">
            {serviceItems.map((item) => (
              <Link
                className="rounded-md px-3 py-2 text-sm font-semibold text-charcoal/80 hover:bg-stonewash hover:text-accentDark"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </details>
        <Link className="shrink-0 hover:text-accentDark" href="/about">
          About
        </Link>
        <Link className="shrink-0 hover:text-accentDark" href="/payment">
          Payment
        </Link>
        <Link className="shrink-0 hover:text-accentDark" href="/faq">
          FAQ
        </Link>
      </nav>
    </header>
  );
}
