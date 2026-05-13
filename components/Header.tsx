import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/Button";

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
            href="/faq"
          >
            FAQ
          </Link>
          <Link
            className="text-sm font-semibold text-charcoal/80 transition hover:text-accentDark"
            href="/payment"
          >
            Payment
          </Link>
          <Link
            className="text-sm font-semibold text-charcoal/80 transition hover:text-accentDark"
            href="/contact"
          >
            Contact
          </Link>
          <Link
            className="text-sm font-semibold text-charcoal/80 transition hover:text-accentDark"
            href="/customer-portal"
          >
            Portal Login
          </Link>
        </nav>

        <Button className="shrink-0 px-3 text-xs sm:px-5 sm:text-sm" href="/request-service">
          Request Service
        </Button>
      </div>

      <nav
        className="flex gap-4 overflow-x-auto border-t border-slate-100 px-4 py-3 text-sm font-semibold text-charcoal/75 lg:hidden"
        aria-label="Mobile navigation"
      >
        <Link className="shrink-0 hover:text-accentDark" href="/">
          Home
        </Link>
        <Link className="shrink-0 hover:text-accentDark" href="/about">
          About
        </Link>
        <Link className="shrink-0 hover:text-accentDark" href="/faq">
          FAQ
        </Link>
        <Link className="shrink-0 hover:text-accentDark" href="/payment">
          Payment
        </Link>
        <Link className="shrink-0 hover:text-accentDark" href="/contact">
          Contact
        </Link>
        <Link className="shrink-0 hover:text-accentDark" href="/customer-portal">
          Portal Login
        </Link>
      </nav>
    </header>
  );
}
