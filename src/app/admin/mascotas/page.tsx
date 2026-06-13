import { AdminPageHeader } from "@/components/admin";
import {
  AdminPetForm,
  AdminPetsList,
  PetMembershipManager,
} from "@/components/admin/pets";
import {
  getAdminPetMemberships,
  getAdminPetOptions,
  getAdminPets,
  getAdminUserOptions,
} from "@/lib/admin/pets/queries";
import { getAdminModule } from "@/config/admin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin — Mascotas",
  description: "Registrar mascotas, fotos y vínculos con tutores.",
};

export default async function AdminMascotasPage() {
  const module = getAdminModule("mascotas");
  const [users, pets, petRows, memberships] = await Promise.all([
    getAdminUserOptions(),
    getAdminPetOptions(),
    getAdminPets(),
    getAdminPetMemberships(),
  ]);

  return (
    <>
      <AdminPageHeader module={module} />
      <div className="mt-6 space-y-8">
        <AdminPetForm users={users} />
        <AdminPetsList pets={petRows} />
        <PetMembershipManager
          users={users}
          pets={pets}
          memberships={memberships}
        />
      </div>
    </>
  );
}
