import { SiteShell } from "@/components/shared/SiteShell";

export const dynamic = "force-dynamic";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell variant="shop">{children}</SiteShell>;
}
