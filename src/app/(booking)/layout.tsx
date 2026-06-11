import { SiteShell } from "@/components/shared/SiteShell";

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell variant="booking">{children}</SiteShell>;
}
