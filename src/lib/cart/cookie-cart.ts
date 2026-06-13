import { cookies } from "next/headers";
import { CART_COOKIE, type CartLine } from "@/lib/cart/types";

function parseCart(raw: string | undefined): CartLine[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (line) =>
        line &&
        typeof line.productId === "string" &&
        typeof line.quantity === "number" &&
        line.quantity > 0,
    );
  } catch {
    return [];
  }
}

export async function readCart(): Promise<CartLine[]> {
  const jar = await cookies();
  return parseCart(jar.get(CART_COOKIE)?.value);
}

export async function writeCart(lines: CartLine[]): Promise<void> {
  const jar = await cookies();
  jar.set(CART_COOKIE, JSON.stringify(lines), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function addProductToCart(
  productId: string,
  quantity = 1,
): Promise<CartLine[]> {
  const cart = await readCart();
  const existing = cart.find((line) => line.productId === productId);

  const next = existing
    ? cart.map((line) =>
        line.productId === productId
          ? { ...line, quantity: line.quantity + quantity }
          : line,
      )
    : [...cart, { productId, quantity }];

  await writeCart(next);
  return next;
}

export async function getCartItemCount(): Promise<number> {
  const cart = await readCart();
  return cart.reduce((sum, line) => sum + line.quantity, 0);
}
