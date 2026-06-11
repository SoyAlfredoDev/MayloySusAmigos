import clsx from "clsx";
import { ProductCard } from "@/components/shop/ProductCard";
import type { StoreProduct } from "@/lib/medusa/sdk";

export interface ProductGridProps {
  products: StoreProduct[];
  className?: string;
}

export function ProductGrid({ products, className }: ProductGridProps) {
  return (
    <div
      className={clsx(
        "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className ?? "mt-10",
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
