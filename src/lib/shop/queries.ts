import { db } from "@/lib/db";
import { toShopCategory, toShopProduct } from "@/lib/shop/mappers";
import type { AdminCategoryRow, AdminProductRow } from "@/lib/shop/mappers";

export async function getActiveCategories() {
  try {
    const categories = await db.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    return categories.map(toShopCategory);
  } catch {
    return [];
  }
}

export async function getActiveProducts(categorySlug?: string) {
  try {
    const products = await db.product.findMany({
      where: {
        isActive: true,
        ...(categorySlug
          ? { category: { slug: categorySlug, isActive: true } }
          : {}),
      },
      include: { category: true },
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    });
    return products.map(toShopProduct);
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await db.product.findFirst({
      where: { slug, isActive: true },
      include: { category: true },
    });
    return product ? toShopProduct(product) : null;
  } catch {
    return null;
  }
}

export async function getFeaturedProducts(limit = 4) {
  try {
    const products = await db.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: limit,
    });
    return products.map(toShopProduct);
  } catch {
    return [];
  }
}

export async function getAdminProducts(): Promise<AdminProductRow[]> {
  try {
    return await db.product.findMany({
      include: { category: true },
      orderBy: { updatedAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getAdminCategories(): Promise<AdminCategoryRow[]> {
  try {
    return await db.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  } catch {
    return [];
  }
}
