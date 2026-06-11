import { SiteShell } from "@/components/shared/SiteShell";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell variant="shop">{children}</SiteShell>;
}
