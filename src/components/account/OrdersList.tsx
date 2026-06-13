"use client";

import Link from "next/link";
import { ProductImage } from "@/components/shop/ProductImage";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  orderStatusLabels,
  paymentStatusLabels,
} from "@/lib/orders/labels";
import type { OrderSummary } from "@/lib/orders/types";
import { formatCLP } from "@/lib/utils";
import { siteConfig } from "@/config/site";

function formatOrderDate(date: Date): string {
  return new Intl.DateTimeFormat(siteConfig.locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function OrdersList({
  orders,
  newOrderId,
}: {
  orders: OrderSummary[];
  newOrderId?: string;
}) {
  if (orders.length === 0) {
    return (
      <Card className="mt-6">
        <p className="font-medium text-ink">Aún no tienes pedidos</p>
        <p className="mt-2 text-sm text-ink-muted">
          Tus compras del pet shop aparecerán aquí después de confirmar el
          checkout.
        </p>
        <Button variant="primary" href="/tienda" className="mt-4">
          Ir a la tienda
        </Button>
      </Card>
    );
  }

  const newOrder = newOrderId
    ? orders.find((order) => order.id === newOrderId)
    : undefined;

  return (
    <div className="mt-6 space-y-4">
      {newOrder && (
        <Alert variant="info" title="Compra confirmada" className="mt-0">
          Tu pedido{" "}
          <span className="text-lg font-bold tracking-wide text-milo-800">
            {newOrder.orderNumber}
          </span>{" "}
          quedó registrado y pagado. Lo verás en preparación para envío a la
          dirección indicada.
        </Alert>
      )}

      {orders.map((order) => {
        const isNew = order.id === newOrderId;

        return (
          <Card
            key={order.id}
            className={isNew ? "ring-2 ring-milo-400 ring-offset-2" : undefined}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xl font-bold tracking-wide text-milo-800">
                  {order.orderNumber}
                </p>
                <p className="mt-1 text-sm font-medium text-milo-700">
                  {formatOrderDate(order.createdAt)}
                </p>
                <p className="mt-1 text-lg font-bold text-ink">
                  {formatCLP(order.total)}
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  {order.shippingAddress.street}, {order.shippingAddress.commune}
                </p>
                {order.customerNotes && (
                  <p className="mt-2 text-xs text-ink-muted">
                    <span className="font-medium text-ink">Tu comentario:</span>{" "}
                    {order.customerNotes}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-pill bg-surface-muted px-3 py-1 text-sm font-medium">
                  {orderStatusLabels[order.status]}
                </span>
                <span className="rounded-pill bg-clinical-100 px-3 py-1 text-sm font-medium text-clinical-600">
                  {paymentStatusLabels[order.paymentStatus]}
                </span>
              </div>
            </div>

            <ul className="mt-4 space-y-3 border-t border-surface-border pt-4">
              {order.items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <Link
                    href={`/tienda/${item.product.slug}`}
                    className="h-12 w-12 shrink-0 overflow-hidden rounded-lg"
                  >
                    <ProductImage
                      src={item.product.imageUrls[0] ?? null}
                      alt={item.product.name}
                      className="h-full w-full rounded-lg"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/tienda/${item.product.slug}`}
                      className="text-sm font-medium text-ink hover:text-milo-600"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-ink-muted">
                      {formatCLP(item.unitPrice)} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-ink">
                    {formatCLP(item.total)}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        );
      })}
    </div>
  );
}
