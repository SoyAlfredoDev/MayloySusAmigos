"use client";

import { useActionState } from "react";
import { addToCart } from "@/actions/shop/cart";
import type { ActionResult } from "@/actions/shop/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const initial: ActionResult | null = null;

export interface AddToCartButtonProps {
  productId: string;
  className?: string;
  size?: "sm" | "md";
  fullWidth?: boolean;
}

export function AddToCartButton({
  productId,
  className,
  size = "md",
  fullWidth = false,
}: AddToCartButtonProps) {
  const [state, formAction, pending] = useActionState(addToCart, initial);

  return (
    <div className={cn(fullWidth && "w-full", className)}>
      <form action={formAction} className={fullWidth ? "w-full" : undefined}>
        <input type="hidden" name="productId" value={productId} />
        <input type="hidden" name="quantity" value="1" />
        <Button
          type="submit"
          variant="cta"
          size={size}
          disabled={pending}
          className={fullWidth ? "w-full" : undefined}
        >
          {pending ? "Agregando..." : "Agregar al carrito"}
        </Button>
      </form>
      {state && !state.ok && (
        <p className="mt-2 text-xs text-clinical-600">{state.error}</p>
      )}
      {state?.ok && (
        <p className="mt-2 text-xs font-semibold text-milo-700">
          ¡Agregado al carrito!
        </p>
      )}
    </div>
  );
}
