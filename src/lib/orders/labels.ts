import type { OrderStatus, PaymentStatus } from "@prisma/client";

export const orderStatusLabels: Record<OrderStatus, string> = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  PROCESSING: "En preparación",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  PENDING: "Pago pendiente",
  AUTHORIZED: "Pago autorizado",
  FAILED: "Pago fallido",
  REFUNDED: "Reembolsado",
};
