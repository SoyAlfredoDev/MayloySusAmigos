"use client";

import { Fragment, useMemo, useState } from "react";
import { AdminOrderDetailPanel } from "@/components/admin/shop/AdminOrderDetailPanel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { AdminOrderRow } from "@/lib/admin/shop/queries";
import {
  emptySalesFilters,
  filterAdminOrders,
  salesStatusQuickFilters,
  type SalesTableFilters,
} from "@/lib/admin/shop/sales-filters";
import {
  orderStatusLabels,
  paymentStatusLabels,
} from "@/lib/orders/labels";
import { cn, formatCLP } from "@/lib/utils";
import { siteConfig } from "@/config/site";

const inputClass =
  "w-full rounded-lg border-2 border-ink/10 px-3 py-2 text-sm";

function formatOrderDate(date: Date): string {
  return new Intl.DateTimeFormat(siteConfig.locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function customerName(user: AdminOrderRow["user"]): string {
  return [user.name, user.lastName].filter(Boolean).join(" ");
}

function hasActiveFilters(filters: SalesTableFilters): boolean {
  return (
    filters.status !== "" ||
    filters.orderNumber.trim() !== "" ||
    filters.customer.trim() !== "" ||
    filters.itemCount.trim() !== ""
  );
}

function SalesFiltersBar({
  filters,
  onChange,
  onClear,
  resultCount,
  totalCount,
}: {
  filters: SalesTableFilters;
  onChange: (next: SalesTableFilters) => void;
  onClear: () => void;
  resultCount: number;
  totalCount: number;
}) {
  return (
    <div className="border-b border-ink/10 px-6 py-4">
      <div className="flex flex-wrap items-center gap-2">
        {salesStatusQuickFilters.map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => onChange({ ...filters, status: option.value })}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors",
              filters.status === option.value
                ? "bg-milo-600 text-white"
                : "bg-surface-soft text-ink-muted hover:bg-milo-50 hover:text-milo-700",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block text-sm">
          <span className="font-semibold text-ink">Nº de pedido</span>
          <input
            type="search"
            value={filters.orderNumber}
            onChange={(e) =>
              onChange({ ...filters, orderNumber: e.target.value })
            }
            placeholder="Ej. ML-20250613-0001"
            className={cn(inputClass, "mt-1")}
          />
        </label>
        <label className="block text-sm">
          <span className="font-semibold text-ink">Cliente</span>
          <input
            type="search"
            value={filters.customer}
            onChange={(e) =>
              onChange({ ...filters, customer: e.target.value })
            }
            placeholder="Nombre o correo"
            className={cn(inputClass, "mt-1")}
          />
        </label>
        <label className="block text-sm">
          <span className="font-semibold text-ink">Cantidad de ítems</span>
          <input
            type="number"
            min={1}
            value={filters.itemCount}
            onChange={(e) =>
              onChange({ ...filters, itemCount: e.target.value })
            }
            placeholder="Ej. 2"
            className={cn(inputClass, "mt-1")}
          />
        </label>
        <div className="flex items-end">
          {hasActiveFilters(filters) && (
            <Button type="button" variant="ghost" size="sm" onClick={onClear}>
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>

      <p className="mt-3 text-sm text-ink-muted">
        {resultCount === totalCount
          ? `${totalCount} pedido(s)`
          : `${resultCount} de ${totalCount} pedido(s)`}
      </p>
    </div>
  );
}

export function AdminSalesTable({
  orders,
  embedded = false,
}: {
  orders: AdminOrderRow[];
  embedded?: boolean;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filters, setFilters] = useState<SalesTableFilters>(emptySalesFilters);

  const filteredOrders = useMemo(
    () => filterAdminOrders(orders, filters),
    [orders, filters],
  );

  const content = (
    <>
      <div className="border-b border-ink/10 px-6 py-5">
        <h2 className="text-lg font-bold text-ink">Ventas</h2>
      </div>

      {orders.length === 0 ? (
        <p className="px-6 py-10 text-sm text-ink-muted">
          Aún no hay ventas. Los pedidos del checkout aparecerán aquí.
        </p>
      ) : (
        <>
          <SalesFiltersBar
            filters={filters}
            onChange={setFilters}
            onClear={() => setFilters(emptySalesFilters)}
            resultCount={filteredOrders.length}
            totalCount={orders.length}
          />

          {filteredOrders.length === 0 ? (
            <p className="px-6 py-10 text-sm text-ink-muted">
              Ningún pedido coincide con los filtros aplicados.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead>
                  <tr className="border-b border-ink/10 bg-surface-soft text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    <th className="px-6 py-3">Pedido</th>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Productos</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-6 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {filteredOrders.map((order) => {
                    const isExpanded = expandedId === order.id;

                    return (
                      <Fragment key={order.id}>
                        <tr className="transition-colors hover:bg-surface-soft/80">
                          <td className="px-6 py-4">
                            <p className="text-base font-bold tracking-wide text-milo-800">
                              {order.orderNumber}
                            </p>
                            <p className="mt-0.5 text-xs text-ink-muted">
                              {formatOrderDate(order.createdAt)}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-medium text-ink">
                              {customerName(order.user)}
                            </p>
                            <p className="text-xs text-ink-muted">
                              {order.user.email}
                            </p>
                          </td>
                          <td className="px-4 py-4 text-ink-muted">
                            {order.items.length} ítem(s)
                          </td>
                          <td className="px-4 py-4 font-semibold text-milo-700">
                            {formatCLP(order.total)}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-1">
                              <Badge className="w-fit">
                                {orderStatusLabels[order.status]}
                              </Badge>
                              <span className="text-xs text-ink-muted">
                                {paymentStatusLabels[order.paymentStatus]}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setExpandedId(isExpanded ? null : order.id)
                              }
                            >
                              {isExpanded ? "Ocultar" : "Ver detalle"}
                            </Button>
                          </td>
                        </tr>
                        {isExpanded && <AdminOrderDetailPanel order={order} />}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </>
  );

  if (embedded) return <div>{content}</div>;

  return <Card className="mt-8 bg-surface p-0">{content}</Card>;
}
