import { db } from "@/lib/db";
import type { ShippingAddress } from "@/lib/orders/types";
import type { OrderStatus, PaymentStatus } from "@prisma/client";

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

export type AdminOrderRow = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: ShippingAddress;
  customerNotes: string | null;
  adminNotes: string | null;
  createdAt: Date;
  user: {
    name: string;
    lastName: string | null;
    email: string;
    phone: string | null;
  };
  items: {
    id: string;
    quantity: number;
    unitPrice: number;
    total: number;
    product: {
      id: string;
      name: string;
      slug: string;
      imageUrls: string[];
    };
  }[];
};

export async function getAdminOrders(): Promise<AdminOrderRow[]> {
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
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
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    subtotal: order.subtotal,
    shippingCost: order.shippingCost,
    total: order.total,
    shippingAddress: parseShippingAddress(order.shippingAddress),
    customerNotes: order.customerNotes,
    adminNotes: order.adminNotes,
    createdAt: order.createdAt,
    user: order.user,
    items: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.total,
      product: item.product,
    })),
  }));
}
