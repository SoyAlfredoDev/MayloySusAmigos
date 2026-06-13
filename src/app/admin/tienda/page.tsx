import { AdminPageHeader } from "@/components/admin";
import {
  CategoryManager,
  ProductForm,
  ProductTable,
} from "@/components/admin/shop";
import { getAdminCategories, getAdminProducts } from "@/lib/shop/queries";
import { getAdminModule } from "@/config/admin";

export const metadata = {
  title: "Admin — Tienda",
  description: "Gestión del pet shop: productos, categorías e inventario.",
};

export default async function AdminTiendaPage() {
  const module = getAdminModule("tienda");
  const [products, categories] = await Promise.all([
    getAdminProducts(),
    getAdminCategories(),
  ]);

  return (
    <>
      <AdminPageHeader module={module} />
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="space-y-8">
          <CategoryManager categories={categories} />
          <ProductForm categories={categories} />
        </div>
        <ProductTable products={products} categories={categories} />
      </div>
    </>
  );
}
