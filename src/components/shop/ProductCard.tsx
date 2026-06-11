import Link from "next/link";
import { Card } from "@/components/ui/Card";
import type { StoreProduct } from "@/lib/medusa/sdk";
import { formatCLP } from "@/lib/utils";

export interface ProductCardProps {
  product: StoreProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const price = product.variants?.[0]?.calculated_price?.calculated_amount;

  return (
    <Link href={`/tienda/${product.handle}`}>
      <Card hover className="group h-full">
        {product.thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.thumbnail}
            alt={product.title ?? "Producto"}
            className="mb-4 aspect-square w-full rounded-lg object-cover"
          />
        )}
        <h2 className="font-bold text-ink group-hover:text-milo-600">
          {product.title}
        </h2>
        {price != null && (
          <p className="mt-2 font-semibold text-milo-700">{formatCLP(price)}</p>
        )}
      </Card>
    </Link>
  );
}
