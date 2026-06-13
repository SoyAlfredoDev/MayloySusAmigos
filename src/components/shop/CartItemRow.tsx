"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { removeFromCart } from "@/actions/shop/cart";
import type { ActionResult } from "@/actions/shop/types";
import { ProductImage } from "@/components/shop/ProductImage";
import { Button } from "@/components/ui/Button";
import { dispatchCartCount } from "@/lib/cart/events";
import type { CartItemView } from "@/lib/cart/types";
import { formatCLP } from "@/lib/utils";

const initial: ActionResult | null = null;

export function CartItemRow({ item }: { item: CartItemView }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(removeFromCart, initial);

  useEffect(() => {
    if (state?.ok && typeof state.itemCount === "number") {
      dispatchCartCount(state.itemCount);
      router.refresh();
    }
  }, [state, router]);

  return (
    <li className="card-milo flex gap-4 bg-surface p-4">
      <Link
        href={`/tienda/${item.slug}`}
        className="h-24 w-24 shrink-0 overflow-hidden rounded-lg"
      >
        <ProductImage
          src={item.thumbnail}
          alt={item.title}
          className="h-full w-full rounded-lg"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          href={`/tienda/${item.slug}`}
          className="font-semibold text-ink hover:text-milo-600"
        >
          {item.title}
        </Link>
        <p className="mt-1 text-sm text-ink-muted">
          {formatCLP(item.price)} × {item.quantity}
        </p>
        <p className="mt-2 font-bold text-milo-700">
          {formatCLP(item.lineTotal)}
        </p>
        {state && !state.ok && (
          <p className="mt-2 text-xs text-clinical-600">{state.error}</p>
        )}
      </div>
      <form action={formAction} className="shrink-0 self-start">
        <input type="hidden" name="productId" value={item.productId} />
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          disabled={pending}
          className="text-clinical-600 hover:bg-clinical-100 hover:text-clinical-600"
          aria-label={`Quitar ${item.title} del carrito`}
        >
          {pending ? "..." : "Quitar"}
        </Button>
      </form>
    </li>
  );
}
