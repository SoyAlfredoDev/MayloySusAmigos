"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { parseIntField, parsePetType } from "@/lib/shop/form";
import { slugify } from "@/lib/utils";
import type { ActionResult } from "@/actions/shop/types";

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = slugify(base);
  let suffix = 0;

  while (true) {
    const candidate = suffix === 0 ? slug : `${slug}-${suffix}`;
    const existing = await db.product.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    suffix += 1;
  }
}

function revalidateShop() {
  revalidatePath("/admin/tienda");
  revalidatePath("/tienda");
  revalidatePath("/");
}

function parseImageUrls(value: FormDataEntryValue | null): string[] {
  const raw = String(value ?? "").trim();
  if (!raw) return [];
  return raw
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean);
}

export async function createProduct(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "").trim() || null;
  const price = parseIntField(formData.get("price"));
  const stock = parseIntField(formData.get("stock"));
  const shortDescription = String(formData.get("shortDescription") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const petType = parsePetType(formData.get("petType"));
  const isFeatured = formData.get("isFeatured") === "on";
  const imageUrls = parseImageUrls(formData.get("imageUrls"));

  if (!name) return { ok: false, error: "El nombre es obligatorio." };
  if (price <= 0) return { ok: false, error: "El precio debe ser mayor a 0." };

  const slug = await uniqueSlug(name);
  const sku = `SKU-${slug.replace(/-/g, "").toUpperCase().slice(0, 10)}`;

  await db.product.create({
    data: {
      name,
      slug,
      sku,
      categoryId,
      price,
      stock,
      shortDescription: shortDescription || null,
      description: description || null,
      petType,
      isFeatured,
      isActive: true,
      imageUrls,
      tags: [],
    },
  });

  revalidateShop();
  return { ok: true, message: "Producto creado." };
}

export async function updateProduct(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "").trim() || null;
  const price = parseIntField(formData.get("price"));
  const stock = parseIntField(formData.get("stock"));
  const shortDescription = String(formData.get("shortDescription") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const petType = parsePetType(formData.get("petType"));
  const isFeatured = formData.get("isFeatured") === "on";
  const isActive = formData.get("isActive") === "on";
  const imageUrls = parseImageUrls(formData.get("imageUrls"));

  if (!id) return { ok: false, error: "Producto no válido." };
  if (!name) return { ok: false, error: "El nombre es obligatorio." };
  if (price <= 0) return { ok: false, error: "El precio debe ser mayor a 0." };

  const current = await db.product.findUnique({ where: { id } });
  if (!current) return { ok: false, error: "Producto no encontrado." };

  const slug =
    name !== current.name ? await uniqueSlug(name, id) : current.slug;

  await db.product.update({
    where: { id },
    data: {
      name,
      slug,
      categoryId,
      price,
      stock,
      shortDescription: shortDescription || null,
      description: description || null,
      petType,
      isFeatured,
      isActive,
      imageUrls,
    },
  });

  revalidateShop();
  return { ok: true, message: "Producto actualizado." };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const inOrders = await db.orderItem.count({ where: { productId: id } });
  if (inOrders > 0) {
    return {
      ok: false,
      error: "No se puede eliminar: el producto tiene pedidos asociados.",
    };
  }

  await db.cartItem.deleteMany({ where: { productId: id } });
  await db.product.delete({ where: { id } });
  revalidateShop();
  return { ok: true, message: "Producto eliminado." };
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  await deleteProduct(id);
}
