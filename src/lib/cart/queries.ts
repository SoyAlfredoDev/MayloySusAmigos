import { db } from "@/lib/db";
import { readCart } from "@/lib/cart/cookie-cart";
import { toShopProduct } from "@/lib/shop/mappers";
import type { CartSummary } from "@/lib/cart/types";

export async function getCartSummary(): Promise<CartSummary> {
  const lines = await readCart();
  if (lines.length === 0) {
    return { items: [], subtotal: 0, itemCount: 0 };
  }

  const products = await db.product.findMany({
    where: {
      id: { in: lines.map((l) => l.productId) },
      isActive: true,
    },
    include: { category: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  const items = lines
    .map((line) => {
      const product = productMap.get(line.productId);
      if (!product) return null;
      const shop = toShopProduct(product);
      return {
        productId: line.productId,
        quantity: line.quantity,
        title: shop.title,
        slug: shop.slug,
        thumbnail: shop.thumbnail,
        price: product.price,
        lineTotal: product.price * line.quantity,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { items, subtotal, itemCount };
}
