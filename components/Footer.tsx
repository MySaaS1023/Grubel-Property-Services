import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-navy text-white">
      <div className="site-container grid gap-8 py-10 md:grid-cols-2 lg:grid-cols-[1.45fr_0.8fr_0.8fr_0.95fr]">
        <div className="lg:pr-4">
          <div className="text-lg font-black">Grubel Property Services</div>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/75">
            Construction-minded property maintenance, repair, turnover prep, and
            project support for residential and commercial properties.
          </p>
          <p className="mt-3 text-xs font-semibold text-white/60">
            All payments are processed securely.
          </p>
        </div>
        <div>
          <div className="text-sm font-bold uppercase tracking-[0.16em] text-white/60">
            Work With Us
          </div>
          <div className="mt-4 grid gap-2 text-sm text-white/80">
            <Link href="/work-with-us/handyman">Handy Man</Link>
            <Link href="/work-with-us/residential">Residential</Link>
            <Link href="/work-with-us/commercial">Commercial</Link>
          </div>
        </div>
        <div>
          <div className="text-sm font-bold uppercase tracking-[0.16em] text-white/60">
            Quick Links
          </div>
          <div className="mt-4 grid gap-2 text-sm text-white/80">
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/payment">Payment</Link>
          </div>
        </div>
        <div>
          <div className="text-sm font-bold uppercase tracking-[0.16em] text-white/60">
            Legal
          </div>
          <div className="mt-4 grid gap-2 text-sm text-white/80">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/subcontractor-terms">Subcontractor Terms</Link>
            <Link href="/subcontractor-agreement-notice">
              Subcontractor Agreement Notice
            </Link>
            <Link href="/disclaimer">Disclaimer</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/60">
        <div className="site-container">
          Copyright {new Date().getFullYear()} Grubel Property Services. grubelps.com
        </div>
      </div>
    </footer>
  );
}
