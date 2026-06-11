import Medusa from "@medusajs/js-sdk";
import type { HttpTypes } from "@medusajs/types";

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000";

export const medusa = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
});

export type StoreProduct = HttpTypes.StoreProduct;
export type StoreCategory = HttpTypes.StoreProductCategory;

export type MedusaError = "missing_publishable_key" | "fetch_failed" | null;

export async function listCategories(): Promise<{
  categories: StoreCategory[];
  error: MedusaError;
}> {
  if (!process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY) {
    return { categories: [], error: "missing_publishable_key" };
  }

  try {
    const { product_categories } = await medusa.store.category.list({
      limit: 50,
      fields: "id,name,handle,description",
    });
    return { categories: product_categories, error: null };
  } catch {
    return { categories: [], error: "fetch_failed" };
  }
}

export async function listProducts(
  regionId?: string,
  options?: { categoryId?: string; limit?: number },
): Promise<{
  products: StoreProduct[];
  error: MedusaError;
}> {
  if (!process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY) {
    return { products: [], error: "missing_publishable_key" };
  }

  try {
    const { products } = await medusa.store.product.list({
      limit: options?.limit ?? 50,
      region_id: regionId,
      category_id: options?.categoryId,
      fields: "*variants.calculated_price,+metadata,*categories",
    });
    return { products, error: null };
  } catch {
    return { products: [], error: "fetch_failed" };
  }
}

export async function getRegionByCountry(countryCode = "cl") {
  if (!process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY) {
    return null;
  }

  try {
    const { regions } = await medusa.store.region.list();
    return regions.find((r) =>
      r.countries?.some((c) => c.iso_2 === countryCode),
    );
  } catch {
    return null;
  }
}
