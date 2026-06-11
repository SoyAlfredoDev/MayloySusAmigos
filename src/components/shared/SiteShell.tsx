import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type SiteShellVariant = "marketing" | "shop" | "booking";

const mainBackground: Record<SiteShellVariant, string> = {
  marketing: "bg-paw-pattern",
  shop: "bg-surface-soft",
  booking: "bg-surface",
};

export interface SiteShellProps {
  children: ReactNode;
  variant?: SiteShellVariant;
}

export function SiteShell({ children, variant = "shop" }: SiteShellProps) {
  return (
    <>
      <Header />
      <main className={cn("flex-1", mainBackground[variant])}>{children}</main>
      <Footer />
    </>
  );
}
