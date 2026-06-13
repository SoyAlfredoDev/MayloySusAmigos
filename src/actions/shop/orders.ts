"use server";

import { getCurrentUserId } from "@/lib/auth/session";
import { getUserOrders } from "@/lib/orders/queries";
import type { OrderSummary } from "@/lib/orders/types";

export async function fetchUserOrders(): Promise<OrderSummary[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];
  return getUserOrders(userId);
}
