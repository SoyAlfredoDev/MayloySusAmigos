import Link from "next/link";
import { PageContainer } from "@/components/shared/PageContainer";
import { ProductImage } from "@/components/shop/ProductImage";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getCartSummary } from "@/lib/cart/queries";
import { formatCLP } from "@/lib/utils";

export const metadata = {
  title: "Carrito",
  description: "Tu carrito de compras — Mailo y sus Amigos",
};

export default async function CartPage() {
  const cart = await getCartSummary();

  return (
    <PageContainer>
      <SectionHeader
        title="Carrito de compras"
        description={
          cart.itemCount > 0
            ? `${cart.itemCount} artículo(s) en tu carrito`
            : "Aún no has agregado productos"
        }
      />

      {cart.items.length === 0 ? (
        <EmptyState
          className="mt-10"
          message="Tu carrito está vacío."
          action={
            <Button variant="primary" href="/tienda">
              Ir a la tienda
            </Button>
          }
        />
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <ul className="space-y-4 lg:col-span-2">
            {cart.items.map((item) => (
              <li
                key={item.productId}
                className="card-milo flex gap-4 bg-surface p-4"
              >
                <Link
                  href={`/tienda/${item.slug}`}
                  className="h-24 w-24 shrink-0 overflow-hidden rounded-lg"
                >
                  <ProductImage
                    src={item.thumbnail}
                    alt={item.title}
                    className="h-full w-full rounded-lg"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/tienda/${item.slug}`}
                    className="font-semibold text-ink hover:text-milo-600"
                  >
                    {item.title}
                  </Link>
                  <p className="mt-1 text-sm text-ink-muted">
                    {formatCLP(item.price)} × {item.quantity}
                  </p>
                  <p className="mt-2 font-bold text-milo-700">
                    {formatCLP(item.lineTotal)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <aside className="card-milo h-fit bg-milo-50 p-6">
            <p className="text-sm font-semibold text-ink-muted">Subtotal</p>
            <p className="mt-2 text-3xl font-bold text-ink">
              {formatCLP(cart.subtotal)}
            </p>
            <Button variant="cta" className="mt-6 w-full" href="/tienda/checkout">
              Ir a pagar
            </Button>
            <Button variant="ghost" className="mt-3 w-full" href="/tienda">
              Seguir comprando
            </Button>
          </aside>
        </div>
      )}
    </PageContainer>
  );
}
