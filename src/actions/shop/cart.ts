"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { addProductToCart } from "@/lib/cart/cookie-cart";
import type { ActionResult } from "@/actions/shop/types";

export async function addToCart(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const productId = String(formData.get("productId") ?? "").trim();
  const quantity = Math.max(1, Number.parseInt(String(formData.get("quantity") ?? "1"), 10) || 1);

  if (!productId) return { ok: false, error: "Producto no válido." };

  const product = await db.product.findFirst({
    where: { id: productId, isActive: true },
  });

  if (!product) return { ok: false, error: "Producto no encontrado." };
  if (product.stock < 1) return { ok: false, error: "Sin stock disponible." };

  const lines = await addProductToCart(productId, quantity);
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);

  revalidatePath("/tienda/carrito");
  revalidatePath("/tienda");
  return { ok: true, itemCount };
}

export async function addToCartAction(formData: FormData): Promise<void> {
  await addToCart(null, formData);
}
