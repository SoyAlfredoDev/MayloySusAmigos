"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { ActionResult } from "@/actions/shop/types";
import { clearCart } from "@/lib/cart/cookie-cart";
import { getCartSummary } from "@/lib/cart/queries";
import { setBookingUserId } from "@/lib/booking/session";
import { db } from "@/lib/db";
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

async function resolveCheckoutUserId(formData: FormData): Promise<string | null> {
  const session = await auth();
  if (session?.user?.id) return session.user.id;

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  if (!name) return null;
  if (!phone) return null;

  const user = await db.user.upsert({
    where: { email },
    update: { name, phone },
    create: { email, name, phone },
    select: { id: true },
  });

  await setBookingUserId(user.id);
  return user.id;
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
        "Inicia sesión o completa tus datos de contacto (nombre, correo y teléfono).",
    };
  }

  const shippingAddress = parseShippingAddress(formData);
  if (!shippingAddress) {
    return {
      ok: false,
      error: "Completa la dirección de envío (calle, comuna y región).",
    };
  }

  const cart = await getCartSummary();
  if (cart.items.length === 0) {
    return { ok: false, error: "Tu carrito está vacío." };
  }

  const products = await db.product.findMany({
    where: { id: { in: cart.items.map((item) => item.productId) }, isActive: true },
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

  const order = await db.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId,
        subtotal: cart.subtotal,
        shippingCost: 0,
        total: cart.subtotal,
        shippingAddress,
        status: "PENDING",
        paymentStatus: "PENDING",
        notes: "Pedido registrado — pago en línea disponible próximamente.",
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

    return created;
  });

  await clearCart();

  revalidatePath("/tienda/carrito");
  revalidatePath("/tienda/checkout");
  revalidatePath("/cuenta/pedidos");
  revalidatePath("/cuenta/perfil");

  redirect(`/cuenta/pedidos?nuevo=${order.id}`);
}
