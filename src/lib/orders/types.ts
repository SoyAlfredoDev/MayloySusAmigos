import type { OrderStatus, PaymentStatus } from "@prisma/client";

export type ShippingAddress = {
  street: string;
  commune: string;
  city: string;
  region: string;
  postalCode?: string;
};

export type OrderItemView = {
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
};

export type OrderSummary = {
  id: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: ShippingAddress;
  createdAt: Date;
  items: OrderItemView[];
};
