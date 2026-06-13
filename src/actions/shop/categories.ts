"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { parseIntField, parsePetType } from "@/lib/shop/form";
import { slugify } from "@/lib/utils";
import type { ActionResult } from "@/actions/shop/types";

async function uniqueCategorySlug(
  base: string,
  excludeId?: string,
): Promise<string> {
  let slug = slugify(base);
  let suffix = 0;

  while (true) {
    const candidate = suffix === 0 ? slug : `${slug}-${suffix}`;
    const existing = await db.category.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    suffix += 1;
  }
}

function revalidateShop() {
  revalidatePath("/admin/tienda");
  revalidatePath("/tienda");
  revalidatePath("/");
}

export async function createCategory(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const petType = parsePetType(formData.get("petType"));
  const sortOrder = parseIntField(formData.get("sortOrder"), 0);

  if (!name) return { ok: false, error: "El nombre es obligatorio." };

  const slug = await uniqueCategorySlug(name);
  const exists = await db.category.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
  });
  if (exists) return { ok: false, error: "Ya existe una categoría con ese nombre." };

  await db.category.create({
    data: {
      name,
      slug,
      description: description || null,
      petType,
      sortOrder,
    },
  });

  revalidateShop();
  return { ok: true, message: "Categoría creada." };
}

export async function updateCategory(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const petType = parsePetType(formData.get("petType"));
  const sortOrder = parseIntField(formData.get("sortOrder"), 0);
  const isActive = formData.get("isActive") === "on";

  if (!id) return { ok: false, error: "Categoría no válida." };
  if (!name) return { ok: false, error: "El nombre es obligatorio." };

  const current = await db.category.findUnique({ where: { id } });
  if (!current) return { ok: false, error: "Categoría no encontrada." };

  const duplicate = await db.category.findFirst({
    where: {
      name: { equals: name, mode: "insensitive" },
      NOT: { id },
    },
  });
  if (duplicate) {
    return { ok: false, error: "Ya existe otra categoría con ese nombre." };
  }

  const slug =
    name !== current.name ? await uniqueCategorySlug(name, id) : current.slug;

  await db.category.update({
    where: { id },
    data: {
      name,
      slug,
      description: description || null,
      petType,
      sortOrder,
      isActive,
    },
  });

  revalidateShop();
  return { ok: true, message: "Categoría actualizada." };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const count = await db.product.count({ where: { categoryId: id } });
  if (count > 0) {
    return {
      ok: false,
      error: "No puedes eliminar una categoría con productos asignados.",
    };
  }

  await db.category.delete({ where: { id } });
  revalidateShop();
  return { ok: true, message: "Categoría eliminada." };
}

export async function deleteCategoryAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  await deleteCategory(id);
}
