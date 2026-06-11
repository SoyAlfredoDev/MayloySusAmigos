import { PageContainer } from "@/components/shared/PageContainer";
import {
  CategoryNav,
  CategorySection,
  MedusaStatusBanner,
  ProductGrid,
  ShopPageHeader,
} from "@/components/shop";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  getRegionByCountry,
  listCategories,
  listProducts,
} from "@/lib/medusa/sdk";

export const metadata = {
  title: "Tienda",
  description:
    "Productos para mascotas: alimentos, accesorios y salud e higiene.",
};

type ShopPageProps = {
  searchParams: Promise<{ categoria?: string }>;
};

function groupProductsByCategory(
  products: Awaited<ReturnType<typeof listProducts>>["products"],
  categories: Awaited<ReturnType<typeof listCategories>>["categories"],
) {
  return categories.map((category) => ({
    category,
    products: products.filter((product) =>
      product.categories?.some((c) => c.id === category.id),
    ),
  }));
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { categoria } = await searchParams;
  const region = await getRegionByCountry(
    process.env.NEXT_PUBLIC_MEDUSA_REGION ?? "cl",
  );

  const [
    { categories, error: categoriesError },
    { products, error: productsError },
  ] = await Promise.all([
    listCategories(),
    listProducts(region?.id),
  ]);

  const error = categoriesError ?? productsError;
  const activeCategory = categoria
    ? categories.find((cat) => cat.handle === categoria)
    : undefined;

  const filteredProducts = activeCategory
    ? products.filter((product) =>
        product.categories?.some((c) => c.id === activeCategory.id),
      )
    : products;

  const grouped = groupProductsByCategory(products, categories);

  return (
    <PageContainer>
      <ShopPageHeader />
      <MedusaStatusBanner error={error} />
      {categories.length > 0 && (
        <CategoryNav
          categories={categories}
          activeHandle={activeCategory?.handle}
        />
      )}
      {activeCategory && filteredProducts.length > 0 && (
        <ProductGrid products={filteredProducts} />
      )}
      {!activeCategory &&
        grouped.map(({ category, products: categoryProducts }) => (
          <CategorySection
            key={category.id}
            category={category}
            products={categoryProducts}
          />
        ))}
      {!error && products.length === 0 && (
        <EmptyState message="No hay productos aún. Ejecuta el seed del backend Medusa para cargar el catálogo pet shop." />
      )}
      {!error &&
        products.length > 0 &&
        activeCategory &&
        filteredProducts.length === 0 && (
          <EmptyState message={`No hay productos en la categoría «${activeCategory.name}».`} />
        )}
    </PageContainer>
  );
}
