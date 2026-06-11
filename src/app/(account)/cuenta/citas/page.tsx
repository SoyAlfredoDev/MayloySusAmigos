import { AccountPageHeader } from "@/components/account";

export const metadata = { title: "Mis Citas" };

export default function AppointmentsPage() {
  return (
    <AccountPageHeader
      title="Mis citas"
      description="Citas activas y pasadas (veterinaria y peluquería) — Fase 1"
    />
  );
}
