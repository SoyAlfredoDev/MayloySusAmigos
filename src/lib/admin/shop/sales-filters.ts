import type { OrderStatus } from "@prisma/client";
import type { AdminOrderRow } from "@/lib/admin/shop/queries";

export type SalesTableFilters = {
  status: OrderStatus | "";
  orderNumber: string;
  customer: string;
  itemCount: string;
};

export const emptySalesFilters: SalesTableFilters = {
  status: "",
  orderNumber: "",
  customer: "",
  itemCount: "",
};

function customerName(user: AdminOrderRow["user"]): string {
  return [user.name, user.lastName].filter(Boolean).join(" ");
}

export function filterAdminOrders(
  orders: AdminOrderRow[],
  filters: SalesTableFilters,
): AdminOrderRow[] {
  const orderNumberQuery = filters.orderNumber.trim().toLowerCase();
  const customerQuery = filters.customer.trim().toLowerCase();
  const itemCount = Number.parseInt(filters.itemCount, 10);

  return orders.filter((order) => {
    if (filters.status && order.status !== filters.status) return false;

    if (
      orderNumberQuery &&
      !order.orderNumber.toLowerCase().includes(orderNumberQuery)
    ) {
      return false;
    }

    if (customerQuery) {
      const name = customerName(order.user).toLowerCase();
      const email = order.user.email.toLowerCase();
      if (!name.includes(customerQuery) && !email.includes(customerQuery)) {
        return false;
      }
    }

    if (Number.isFinite(itemCount) && order.items.length !== itemCount) {
      return false;
    }

    return true;
  });
}

export const salesStatusQuickFilters: {
  value: OrderStatus | "";
  label: string;
}[] = [
  { value: "", label: "Todos" },
  { value: "PENDING", label: "Pendiente" },
  { value: "PROCESSING", label: "En preparación" },
  { value: "PAID", label: "Pagado" },
  { value: "SHIPPED", label: "Enviado" },
  { value: "DELIVERED", label: "Entregado" },
];
