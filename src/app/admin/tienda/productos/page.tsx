import { AdminPageHeader } from "@/components/admin";
import { ShopTiendaShell } from "@/components/admin/shop/ShopTiendaShell";
import { getAdminCategories, getAdminProducts } from "@/lib/shop/queries";
import { getAdminModule } from "@/config/admin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin — Tienda · Productos",
  description: "Catálogo de productos del pet shop.",
};

export default async function AdminTiendaProductosPage() {
  const module = getAdminModule("tienda");
  const [products, categories] = await Promise.all([
    getAdminProducts(),
    getAdminCategories(),
  ]);

  return (
    <>
      <AdminPageHeader module={module} />
      <ShopTiendaShell
        active="productos"
        products={products}
        categories={categories}
      />
    </>
  );
}
