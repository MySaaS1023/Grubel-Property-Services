import type { Metadata } from "next";
import "./globals.css";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: {
    default: "Grubel Property Services",
    template: "%s | Grubel Property Services",
  },
  description:
    "Preventative property checks, minor repair support, and turnover prep for homeowners, landlords, and property managers in Arizona.",
  metadataBase: new URL("https://grubelps.com"),
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-charcoal antialiased">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
