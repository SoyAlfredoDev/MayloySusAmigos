import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { StoreProduct } from "@/lib/medusa/sdk";
import { formatCLP } from "@/lib/utils";

export interface ProductDetailProps {
  product: StoreProduct;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const price = product.variants?.[0]?.calculated_price?.calculated_amount;

  return (
    <>
      <Link href="/tienda" className="text-sm font-medium text-milo-600">
        ← Volver a la tienda
      </Link>

      <div className="mt-8 grid gap-10 md:grid-cols-2">
        {product.thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.thumbnail}
            alt={product.title ?? "Producto"}
            className="aspect-square w-full rounded-milo border-2 border-ink/10 object-cover"
          />
        )}
        <div>
          <h1 className="section-title">{product.title}</h1>
          {price != null && (
            <p className="mt-4 text-2xl font-bold text-milo-700">
              {formatCLP(price)}
            </p>
          )}
          {product.description && (
            <p className="mt-6 text-ink-muted">{product.description}</p>
          )}
          <Button
            variant="cta"
            className="mt-8"
            href={`${process.env.NEXT_PUBLIC_MEDUSA_STOREFRONT_URL ?? "http://localhost:8000/cl"}/products/${product.handle}`}
            external
          >
            Comprar en tienda Medusa
          </Button>
        </div>
      </div>
    </>
  );
}
