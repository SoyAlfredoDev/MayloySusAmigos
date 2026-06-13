import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { ProductImage } from "@/components/shop/ProductImage";
import type { ShopProduct } from "@/types/shop";
import { formatCLP } from "@/lib/utils";

export interface ProductCardProps {
  product: ShopProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card hover className="flex h-full flex-col overflow-hidden p-0">
      <Link href={`/tienda/${product.slug}`} className="block flex-1 p-4 pb-0">
        <ProductImage
          src={product.thumbnail}
          alt={product.title}
          className="mb-4 rounded-lg"
        />
        <h2 className="font-bold text-ink transition-colors hover:text-milo-600">
          {product.title}
        </h2>
        {product.price != null && (
          <p className="mt-2 font-semibold text-milo-700">
            {formatCLP(product.price)}
          </p>
        )}
      </Link>
      <div className="p-4 pt-3">
        <AddToCartButton productId={product.id} size="sm" fullWidth />
      </div>
    </Card>
  );
}
