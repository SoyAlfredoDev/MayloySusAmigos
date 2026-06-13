import { db } from "@/lib/db";
import type { OrderSummary, ShippingAddress } from "@/lib/orders/types";

function parseShippingAddress(value: unknown): ShippingAddress {
  const raw = value as Partial<ShippingAddress> | null;
  return {
    street: String(raw?.street ?? ""),
    commune: String(raw?.commune ?? ""),
    city: String(raw?.city ?? "Santiago"),
    region: String(raw?.region ?? ""),
    postalCode: raw?.postalCode ? String(raw.postalCode) : undefined,
  };
}

export async function getUserOrders(userId: string): Promise<OrderSummary[]> {
  const orders = await db.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              imageUrls: true,
            },
          },
        },
      },
    },
  });

  return orders.map((order) => ({
    id: order.id,
    status: order.status,
    paymentStatus: order.paymentStatus,
    subtotal: order.subtotal,
    shippingCost: order.shippingCost,
    total: order.total,
    shippingAddress: parseShippingAddress(order.shippingAddress),
    createdAt: order.createdAt,
    items: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.total,
      product: item.product,
    })),
  }));
}

export async function getUserOrdersCount(userId: string): Promise<number> {
  return db.order.count({ where: { userId } });
}
