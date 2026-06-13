import type { Category, Product } from "@prisma/client";
import type { ShopCategory, ShopProduct } from "@/types/shop";

type ProductWithCategory = Product & {
  category: Category | null;
};

export function toShopCategory(category: Category): ShopCategory {
  return {
    id: category.id,
    slug: category.slug,
    name: category.name,
    description: category.description ?? "",
  };
}

export function toShopProduct(product: ProductWithCategory): ShopProduct {
  return {
    id: product.id,
    slug: product.slug,
    title: product.name,
    description: product.description ?? product.shortDescription ?? "",
    thumbnail: product.imageUrls[0] ?? null,
    price: product.price,
    categories: product.category ? [toShopCategory(product.category)] : [],
  };
}

export type AdminProductRow = ProductWithCategory;

export type AdminCategoryRow = Category & {
  _count: { products: number };
};
