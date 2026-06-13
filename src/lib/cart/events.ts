export const CART_COUNT_EVENT = "mailo:cart-count";

export function dispatchCartCount(count: number): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(CART_COUNT_EVENT, { detail: { count } }),
  );
}
