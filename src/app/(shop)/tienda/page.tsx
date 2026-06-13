import { PageContainer } from "@/components/shared/PageContainer";
import {
  CategoryNav,
  ProductGrid,
  ShopPageHeader,
} from "@/components/shop";
import { EmptyState } from "@/components/ui/EmptyState";
import { getActiveCategories, getActiveProducts } from "@/lib/shop/queries";

export const metadata = {
  title: "Tienda",
  description:
    "Productos para mascotas: alimentos, accesorios y salud e higiene.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const [categories, products] = await Promise.all([
    getActiveCategories(),
    getActiveProducts(categoria),
  ]);

  return (
    <PageContainer>
      <ShopPageHeader />
      <CategoryNav categories={categories} activeSlug={categoria} />
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <EmptyState message="No hay productos en esta categoría por ahora." />
      )}
    </PageContainer>
  );
}
