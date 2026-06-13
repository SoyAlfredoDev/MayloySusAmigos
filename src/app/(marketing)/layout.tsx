import { SiteShell } from "@/components/shared/SiteShell";

export const dynamic = "force-dynamic";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell variant="marketing">{children}</SiteShell>;
}
