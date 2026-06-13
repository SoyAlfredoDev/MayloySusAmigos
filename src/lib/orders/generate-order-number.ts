import type { Prisma } from "@prisma/client";

function datePrefix(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
}

type OrderClient = Pick<Prisma.TransactionClient, "order">;

/** Formato: ML-YYYYMMDD-0001 (secuencia diaria, único en BD). */
export async function generateOrderNumber(
  tx: OrderClient,
  date = new Date(),
): Promise<string> {
  const prefix = `ML-${datePrefix(date)}`;

  for (let attempt = 0; attempt < 20; attempt++) {
    const count = await tx.order.count({
      where: {
        orderNumber: { startsWith: prefix },
        createdAt: { gte: startOfDay(date), lt: endOfDay(date) },
      },
    });
    const candidate = `${prefix}-${String(count + 1).padStart(4, "0")}`;
    const exists = await tx.order.findUnique({
      where: { orderNumber: candidate },
      select: { id: true },
    });
    if (!exists) return candidate;
  }

  const fallback = `${prefix}-${Date.now().toString().slice(-6)}`;
  return fallback;
}
