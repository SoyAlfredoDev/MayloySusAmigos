import { AccountPageHeader } from "@/components/account";

export const metadata = { title: "Mis Mascotas" };

export default function PetsPage() {
  return (
    <AccountPageHeader
      title="Mis mascotas"
      description="Registro de mascotas, raza, edad e historial clínico — Fase 1"
    />
  );
}
