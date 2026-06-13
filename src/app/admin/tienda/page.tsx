import { AdminPageHeader } from "@/components/admin";
import { ShopTiendaShell } from "@/components/admin/shop/ShopTiendaShell";
import { getAdminOrders } from "@/lib/admin/shop/queries";
import { getAdminCategories } from "@/lib/shop/queries";
import { getAdminModule } from "@/config/admin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin — Tienda",
  description: "Gestión del pet shop: ventas, productos y categorías.",
};

export default async function AdminTiendaPage() {
  const module = getAdminModule("tienda");
  const [orders, categories] = await Promise.all([
    getAdminOrders(),
    getAdminCategories(),
  ]);

  return (
    <>
      <AdminPageHeader module={module} />
      <ShopTiendaShell active="ventas" orders={orders} categories={categories} />
    </>
  );
}
