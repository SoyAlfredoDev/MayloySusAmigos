"use server";

import { revalidatePath } from "next/cache";
import type { OrderStatus } from "@prisma/client";
import type { ActionResult } from "@/actions/shop/types";
import { db } from "@/lib/db";

const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

function revalidateOrderPaths() {
  revalidatePath("/admin/tienda");
  revalidatePath("/cuenta/pedidos");
}

export async function updateOrderAdmin(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim() as OrderStatus;
  const adminNotes = String(formData.get("adminNotes") ?? "").trim();

  if (!id) return { ok: false, error: "Pedido no válido." };
  if (!ORDER_STATUSES.includes(status)) {
    return { ok: false, error: "Estado de pedido no válido." };
  }

  const existing = await db.order.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "Pedido no encontrado." };

  await db.order.update({
    where: { id },
    data: {
      status,
      adminNotes: adminNotes || null,
    },
  });

  revalidateOrderPaths();
  return { ok: true, message: "Pedido actualizado." };
}
