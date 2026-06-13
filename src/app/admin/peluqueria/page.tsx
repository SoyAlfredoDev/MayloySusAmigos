import { AdminPageHeader, AdminSectionGrid } from "@/components/admin";
import { getAdminModule } from "@/config/admin";

export const metadata = {
  title: "Admin — Peluquería",
  description: "Gestión de citas, peluqueros y servicios de grooming.",
};

const sections = [
  {
    title: "Citas del día",
    description: "Reservas, confirmaciones y lista de espera.",
  },
  {
    title: "Peluqueros",
    description: "Equipo, servicios que ofrece cada profesional.",
  },
  {
    title: "Servicios",
    description: "Baño, corte, spa y precios por tamaño de mascota.",
  },
  {
    title: "Horarios",
    description: "Disponibilidad semanal y bloqueos.",
  },
];

export default function AdminPeluqueriaPage() {
  const module = getAdminModule("peluqueria");

  return (
    <>
      <AdminPageHeader module={module} />
      <AdminSectionGrid sections={sections} className="mt-6" />
    </>
  );
}
