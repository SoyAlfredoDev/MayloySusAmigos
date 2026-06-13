"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CART_COUNT_EVENT } from "@/lib/cart/events";
import { cn } from "@/lib/utils";

export interface CartNavLinkProps {
  initialCount?: number;
  className?: string;
}

function formatCount(count: number): string {
  if (count > 99) return "99+";
  return String(count);
}

export function CartNavLink({
  initialCount = 0,
  className,
}: CartNavLinkProps) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    function onCartCount(event: Event) {
      const detail = (event as CustomEvent<{ count: number }>).detail;
      if (typeof detail?.count === "number") {
        setCount(detail.count);
      }
    }

    window.addEventListener(CART_COUNT_EVENT, onCartCount);
    return () => window.removeEventListener(CART_COUNT_EVENT, onCartCount);
  }, []);

  return (
    <Link
      href="/tienda/carrito"
      className={cn(
        "relative inline-flex items-center rounded-pill px-3 py-2 text-sm font-semibold text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink",
        className,
      )}
      aria-label={
        count > 0 ? `Carrito, ${count} producto(s)` : "Carrito vacío"
      }
    >
      Carrito
      {count > 0 && (
        <span
          className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-clinical-500 px-1 text-[10px] font-bold leading-none text-white shadow-sm ring-2 ring-surface"
          aria-hidden
        >
          {formatCount(count)}
        </span>
      )}
    </Link>
  );
}
