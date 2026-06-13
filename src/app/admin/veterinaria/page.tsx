import { AdminPageHeader } from "@/components/admin";
import {
  VeterinaryScheduleManager,
  VeterinaryServiceManager,
} from "@/components/admin/veterinary";
import {
  getAdminProfessionalSchedules,
  getAdminVetProfessionals,
  getAdminVetServices,
} from "@/lib/admin/veterinary/queries";
import { getAdminModule } from "@/config/admin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin — Veterinaria",
  description: "Gestión de citas, profesionales y horarios de la clínica veterinaria.",
};

export default async function AdminVeterinariaPage() {
  const module = getAdminModule("veterinaria");
  const [professionals, services] = await Promise.all([
    getAdminVetProfessionals(),
    getAdminVetServices(),
  ]);

  const schedulesByProfessional: Record<
    string,
    Awaited<ReturnType<typeof getAdminProfessionalSchedules>>
  > = {};

  await Promise.all(
    professionals.map(async (professional) => {
      schedulesByProfessional[professional.id] =
        await getAdminProfessionalSchedules(professional.id);
    }),
  );

  return (
    <>
      <AdminPageHeader module={module} />
      <div className="mt-6 grid gap-8 xl:grid-cols-2">
        <VeterinaryServiceManager services={services} />
        <VeterinaryScheduleManager
          professionals={professionals}
          schedulesByProfessional={schedulesByProfessional}
        />
      </div>
    </>
  );
}
