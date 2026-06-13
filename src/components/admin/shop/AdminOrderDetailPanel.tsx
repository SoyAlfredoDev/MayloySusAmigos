"use client";

import { useActionState } from "react";
import { updateOrderAdmin } from "@/actions/admin/orders";
import type { ActionResult } from "@/actions/shop/types";
import { ProductImage } from "@/components/shop/ProductImage";
import { Button } from "@/components/ui/Button";
import type { AdminOrderRow } from "@/lib/admin/shop/queries";
import { orderStatusLabels } from "@/lib/orders/labels";
import { formatCLP } from "@/lib/utils";

const initial: ActionResult | null = null;

const inputClass =
  "mt-1 w-full rounded-lg border-2 border-ink/10 px-3 py-2 text-sm";

const ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;

function customerName(user: AdminOrderRow["user"]): string {
  return [user.name, user.lastName].filter(Boolean).join(" ");
}

export function AdminOrderDetailPanel({ order }: { order: AdminOrderRow }) {
  const [state, formAction, pending] = useActionState(updateOrderAdmin, initial);

  return (
    <tr>
      <td colSpan={6} className="bg-surface-soft px-6 py-5">
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Nº de pedido
              </p>
              <p className="mt-1 text-lg font-bold tracking-wide text-milo-800">
                {order.orderNumber}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Contacto
              </p>
              <p className="mt-1 text-sm font-medium text-ink">
                {customerName(order.user)}
              </p>
              <p className="text-sm text-ink-muted">{order.user.email}</p>
              <p className="text-sm text-ink-muted">
                {order.user.phone ?? "Sin teléfono"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Envío
              </p>
              <p className="mt-1 text-sm text-ink">
                {order.shippingAddress.street}
              </p>
              <p className="text-sm text-ink-muted">
                {order.shippingAddress.commune}, {order.shippingAddress.city}
              </p>
              <p className="text-sm text-ink-muted">
                {order.shippingAddress.region}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Comentario del cliente
              </p>
              <p className="mt-1 text-sm text-ink">
                {order.customerNotes ?? "—"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <ul className="space-y-2">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-ink/10">
                    <ProductImage
                      src={item.product.imageUrls[0] ?? null}
                      alt={item.product.name}
                      className="h-full w-full rounded-lg"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">
                      {item.product.name}
                    </p>
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

            <form action={formAction} className="rounded-xl border border-ink/10 bg-surface p-4">
              <input type="hidden" name="id" value={order.id} />
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Gestión interna
              </p>
              <label className="mt-3 block text-sm">
                <span className="font-semibold text-ink">Estado del pedido</span>
                <select
                  name="status"
                  defaultValue={order.status}
                  className={inputClass}
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {orderStatusLabels[status]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="mt-3 block text-sm">
                <span className="font-semibold text-ink">
                  Notas internas (no visible al cliente)
                </span>
                <textarea
                  name="adminNotes"
                  rows={3}
                  defaultValue={order.adminNotes ?? ""}
                  placeholder="Coordinación de despacho, incidencias, seguimiento…"
                  className={inputClass}
                />
              </label>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="mt-3"
                disabled={pending}
              >
                {pending ? "Guardando..." : "Guardar gestión"}
              </Button>
              {state && !state.ok && (
                <p className="mt-2 text-sm text-clinical-600">{state.error}</p>
              )}
              {state?.ok && (
                <p className="mt-2 text-sm text-milo-700">{state.message}</p>
              )}
            </form>
          </div>
        </div>
      </td>
    </tr>
  );
}
