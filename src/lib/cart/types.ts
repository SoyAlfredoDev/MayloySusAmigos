export type CartLine = {
  productId: string;
  quantity: number;
};

export const CART_COOKIE = "mailo-cart";

export type CartItemView = {
  productId: string;
  quantity: number;
  title: string;
  slug: string;
  thumbnail: string | null;
  price: number;
  lineTotal: number;
};

export type CartSummary = {
  items: CartItemView[];
  subtotal: number;
  itemCount: number;
};
