import { AdminPageHeader } from "@/components/admin";
import { AdminClientsTable } from "@/components/admin/clients";
import { getAdminClients } from "@/lib/admin/clients/queries";
import { getAdminModule } from "@/config/admin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin — Clientes",
  description: "Clientes registrados en la plataforma.",
};

export default async function AdminClientesPage() {
  const module = getAdminModule("clientes");
  const clients = await getAdminClients();

  return (
    <>
      <AdminPageHeader module={module} />
      <AdminClientsTable clients={clients} />
    </>
  );
}
