import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/Button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="site-container flex items-center justify-between gap-3 py-2 sm:gap-6 lg:gap-8">
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

        <nav className="hidden items-center gap-5 lg:flex xl:gap-7" aria-label="Main navigation">
          <Link
            className="text-sm font-semibold text-charcoal/80 transition hover:text-accentDark"
            href="/"
          >
            Home
          </Link>
          <Link
            className="text-sm font-semibold text-charcoal/80 transition hover:text-accentDark"
            href="/about"
          >
            About
          </Link>
          <Link
            className="text-sm font-semibold text-charcoal/80 transition hover:text-accentDark"
            href="/services"
          >
            Services
          </Link>
          <Link
            className="text-sm font-semibold text-charcoal/80 transition hover:text-accentDark"
            href="/faq"
          >
            FAQ
          </Link>
          <Link
            className="text-sm font-semibold text-charcoal/80 transition hover:text-accentDark"
            href="/contact"
          >
            Contact
          </Link>
          <Link
            className="whitespace-nowrap text-sm font-semibold text-charcoal/80 transition hover:text-accentDark"
            href="/customer-login"
          >
            Customer Portal
          </Link>
          <div className="group relative">
            <button
              className="whitespace-nowrap text-sm font-semibold text-charcoal/80 transition hover:text-accentDark"
              type="button"
            >
              Work With Us
            </button>
            <div className="invisible absolute right-0 top-full z-50 min-w-48 rounded-lg border border-slate-200 bg-white p-2 opacity-0 shadow-soft transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <Link
                className="block rounded-md px-3 py-2 text-sm font-semibold text-charcoal/80 hover:bg-stonewash hover:text-accentDark"
                href="/work-with-us/handyman"
              >
                Handy Man
              </Link>
              <Link
                className="block rounded-md px-3 py-2 text-sm font-semibold text-charcoal/80 hover:bg-stonewash hover:text-accentDark"
                href="/work-with-us/residential"
              >
                Residential
              </Link>
              <Link
                className="block rounded-md px-3 py-2 text-sm font-semibold text-charcoal/80 hover:bg-stonewash hover:text-accentDark"
                href="/work-with-us/commercial"
              >
                Commercial
              </Link>
            </div>
          </div>
        </nav>

        <div className="flex shrink-0 flex-col items-end gap-1">
          <a
            className="whitespace-nowrap text-[11px] font-black uppercase tracking-[0.12em] text-charcoal/65 transition hover:text-accentDark sm:text-xs"
            href="tel:4804207398"
          >
            Call Us: (480) 420-7398
          </a>
          <Button className="px-3 text-xs sm:px-5 sm:text-sm" href="/request-service">
            Request Service
          </Button>
        </div>
      </div>

      <nav
        className="site-container flex gap-4 overflow-x-auto border-t border-slate-100 py-3 text-sm font-semibold text-charcoal/75 lg:hidden"
        aria-label="Mobile navigation"
      >
        <Link className="shrink-0 hover:text-accentDark" href="/">
          Home
        </Link>
        <Link className="shrink-0 hover:text-accentDark" href="/about">
          About
        </Link>
        <Link className="shrink-0 hover:text-accentDark" href="/services">
          Services
        </Link>
        <Link className="shrink-0 hover:text-accentDark" href="/faq">
          FAQ
        </Link>
        <Link className="shrink-0 hover:text-accentDark" href="/contact">
          Contact
        </Link>
        <Link className="shrink-0 whitespace-nowrap hover:text-accentDark" href="/customer-login">
          Customer Portal
        </Link>
        <Link className="shrink-0 whitespace-nowrap hover:text-accentDark" href="/work-with-us/handyman">
          Handy Man
        </Link>
        <Link className="shrink-0 hover:text-accentDark" href="/work-with-us/residential">
          Residential
        </Link>
        <Link className="shrink-0 hover:text-accentDark" href="/work-with-us/commercial">
          Commercial
        </Link>
      </nav>
    </header>
  );
}
