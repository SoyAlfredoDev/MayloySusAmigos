import { AdminPageHeader, AdminSectionGrid } from "@/components/admin";
import { getAdminModule } from "@/config/admin";

export const metadata = {
  title: "Admin — Veterinaria",
  description: "Gestión de citas, profesionales y horarios de la clínica veterinaria.",
};

const sections = [
  {
    title: "Citas del día",
    description: "Agenda diaria, confirmaciones y cancelaciones.",
  },
  {
    title: "Profesionales",
    description: "Veterinarios, especialidades y disponibilidad.",
  },
  {
    title: "Servicios y especialidades",
    description: "Consultas, vacunas, controles y procedimientos.",
  },
  {
    title: "Horarios y bloqueos",
    description: "Turnos recurrentes y bloqueos puntuales.",
  },
];

export default function AdminVeterinariaPage() {
  const module = getAdminModule("veterinaria");

  return (
    <>
      <AdminPageHeader module={module} />
      <AdminSectionGrid sections={sections} />
    </>
  );
}
