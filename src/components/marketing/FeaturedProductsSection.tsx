import { ProductGrid } from "@/components/shop/ProductGrid";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { getFeaturedProducts } from "@/lib/shop/queries";

export async function FeaturedProductsSection() {
  const products = await getFeaturedProducts(4);

  if (products.length === 0) return null;

  return (
    <section className="mt-20">
      <SectionHeader
        title="Productos destacados"
        description="Lo más popular de nuestro pet shop."
        action={
          <Button variant="primary" href="/tienda" size="sm">
            Ver tienda
          </Button>
        }
      />
      <ProductGrid products={products} className="mt-8" />
    </section>
  );
}
