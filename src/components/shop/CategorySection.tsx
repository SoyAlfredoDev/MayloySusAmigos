import { ProductGrid } from "@/components/shop/ProductGrid";
import type { StoreCategory, StoreProduct } from "@/lib/medusa/sdk";

export interface CategorySectionProps {
  category: StoreCategory;
  products: StoreProduct[];
}

export function CategorySection({ category, products }: CategorySectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="mt-14">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-ink">{category.name}</h2>
        {category.description && (
          <p className="mt-1 max-w-2xl text-sm text-ink/70">
            {category.description}
          </p>
        )}
      </div>
      <ProductGrid products={products} className="mt-0" />
    </section>
  );
}
