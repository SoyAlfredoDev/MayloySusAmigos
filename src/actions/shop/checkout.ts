"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { ActionResult } from "@/actions/shop/types";
import { clearCart } from "@/lib/cart/cookie-cart";
import { getCartSummary } from "@/lib/cart/queries";
import { setBookingUserId } from "@/lib/booking/session";
import { db } from "@/lib/db";
import { generateOrderNumber } from "@/lib/orders/generate-order-number";
import type { ShippingAddress } from "@/lib/orders/types";

const CHILE_REGIONS = new Set([
  "Arica y Parinacota",
  "Tarapacá",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaíso",
  "Metropolitana",
  "O'Higgins",
  "Maule",
  "Ñuble",
  "Biobío",
  "La Araucanía",
  "Los Ríos",
  "Los Lagos",
  "Aysén",
  "Magallanes",
]);

function parseShippingAddress(formData: FormData): ShippingAddress | null {
  const street = String(formData.get("street") ?? "").trim();
  const commune = String(formData.get("commune") ?? "").trim();
  const city = String(formData.get("city") ?? "Santiago").trim() || "Santiago";
  const region = String(formData.get("region") ?? "").trim();
  const postalCode = String(formData.get("postalCode") ?? "").trim();

  if (!street) return null;
  if (!commune) return null;
  if (!region || !CHILE_REGIONS.has(region)) return null;

  return {
    street,
    commune,
    city,
    region,
    postalCode: postalCode || undefined,
  };
}

function parseCustomerNotes(formData: FormData): string | null {
  const value = String(formData.get("customerNotes") ?? "").trim();
  return value || null;
}

async function resolveCheckoutUserId(
  formData: FormData,
): Promise<string | null> {
  const phone = String(formData.get("phone") ?? "").trim();
  if (!phone) return null;

  const session = await auth();
  if (session?.user?.id) {
    await db.user.update({
      where: { id: session.user.id },
      data: { phone },
    });
    return session.user.id;
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  if (!name) return null;

  const user = await db.user.upsert({
    where: { email },
    update: { name, phone },
    create: { email, name, phone },
    select: { id: true },
  });

  await setBookingUserId(user.id);
  return user.id;
}

function revalidateOrderPaths() {
  revalidatePath("/tienda/carrito");
  revalidatePath("/tienda/checkout");
  revalidatePath("/cuenta/pedidos");
  revalidatePath("/cuenta/perfil");
  revalidatePath("/admin/tienda");
  revalidatePath("/admin/tienda/productos");
  revalidatePath("/tienda");
}

export async function placeOrder(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const userId = await resolveCheckoutUserId(formData);
  if (!userId) {
    return {
      ok: false,
      error:
        "Completa tus datos de contacto: nombre, correo y teléfono son obligatorios.",
    };
  }

  const shippingAddress = parseShippingAddress(formData);
  if (!shippingAddress) {
    return {
      ok: false,
      error:
        "La dirección de envío es obligatoria: calle, comuna y región.",
    };
  }

  const cart = await getCartSummary();
  if (cart.items.length === 0) {
    return { ok: false, error: "Tu carrito está vacío." };
  }

  const products = await db.product.findMany({
    where: {
      id: { in: cart.items.map((item) => item.productId) },
      isActive: true,
    },
    select: { id: true, stock: true, name: true },
  });
  const stockMap = new Map(products.map((p) => [p.id, p]));

  for (const item of cart.items) {
    const product = stockMap.get(item.productId);
    if (!product) {
      return {
        ok: false,
        error: "Un producto del carrito ya no está disponible.",
      };
    }
    if (product.stock < item.quantity) {
      return {
        ok: false,
        error: `Stock insuficiente para «${product.name}».`,
      };
    }
  }

  const customerNotes = parseCustomerNotes(formData);

  const order = await db.$transaction(async (tx) => {
    for (const item of cart.items) {
      const updated = await tx.product.updateMany({
        where: {
          id: item.productId,
          stock: { gte: item.quantity },
        },
        data: { stock: { decrement: item.quantity } },
      });
      if (updated.count !== 1) {
        throw new Error("STOCK_CONFLICT");
      }
    }

    const orderNumber = await generateOrderNumber(tx);

    return tx.order.create({
      data: {
        orderNumber,
        userId,
        subtotal: cart.subtotal,
        shippingCost: 0,
        total: cart.subtotal,
        shippingAddress,
        status: "PROCESSING",
        paymentStatus: "AUTHORIZED",
        customerNotes,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.price,
            total: item.lineTotal,
          })),
        },
      },
      select: { id: true },
    });
  }).catch((error: unknown) => {
    if (error instanceof Error && error.message === "STOCK_CONFLICT") {
      return null;
    }
    throw error;
  });

  if (!order) {
    return {
      ok: false,
      error: "No hay stock suficiente para completar el pedido.",
    };
  }

  await clearCart();
  revalidateOrderPaths();

  redirect(`/cuenta/pedidos?nuevo=${order.id}`);
}
