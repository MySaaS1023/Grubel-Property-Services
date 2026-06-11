"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SiteChatbot } from "@/components/SiteChatbot";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  return (
    <>
      {!isAdminRoute ? <Header /> : null}
      <main>{children}</main>
      {!isAdminRoute ? <Footer /> : null}
      {!isAdminRoute ? <SiteChatbot /> : null}
    </>
  );
}
