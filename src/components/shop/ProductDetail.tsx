import Link from "next/link";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { ProductImage } from "@/components/shop/ProductImage";
import type { ShopProduct } from "@/types/shop";
import { formatCLP } from "@/lib/utils";

export interface ProductDetailProps {
  product: ShopProduct;
}

export function ProductDetail({ product }: ProductDetailProps) {
  return (
    <>
      <Link href="/tienda" className="text-sm font-medium text-milo-600">
        ← Volver a la tienda
      </Link>

      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <ProductImage
          src={product.thumbnail}
          alt={product.title}
          className="rounded-milo border-2 border-ink/10"
        />
        <div>
          <h1 className="section-title">{product.title}</h1>
          {product.price != null && (
            <p className="mt-4 text-2xl font-bold text-milo-700">
              {formatCLP(product.price)}
            </p>
          )}
          {product.description && (
            <p className="mt-6 text-ink-muted">{product.description}</p>
          )}
          <AddToCartButton
            productId={product.id}
            className="mt-8"
            fullWidth
          />
        </div>
      </div>
    </>
  );
}
