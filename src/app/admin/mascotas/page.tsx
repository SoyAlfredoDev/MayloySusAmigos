import { AdminPageHeader } from "@/components/admin";
import { PetMembershipManager } from "@/components/admin/pets";
import {
  getAdminPetMemberships,
  getAdminPetOptions,
  getAdminUserOptions,
} from "@/lib/admin/pets/queries";
import { getAdminModule } from "@/config/admin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin — Mascotas",
  description: "Vincular tutores con mascotas y gestionar asociaciones.",
};

export default async function AdminMascotasPage() {
  const module = getAdminModule("mascotas");
  const [users, pets, memberships] = await Promise.all([
    getAdminUserOptions(),
    getAdminPetOptions(),
    getAdminPetMemberships(),
  ]);

  return (
    <>
      <AdminPageHeader module={module} />
      <div className="mt-10">
        <PetMembershipManager
          users={users}
          pets={pets}
          memberships={memberships}
        />
      </div>
    </>
  );
}
