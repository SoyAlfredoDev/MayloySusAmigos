"use client";

import { useActionState } from "react";
import Link from "next/link";
import { placeOrder } from "@/actions/shop/checkout";
import type { ActionResult } from "@/actions/shop/types";
import { LoginForm } from "@/components/auth/LoginForm";
import { ProductImage } from "@/components/shop/ProductImage";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { CartSummary } from "@/lib/cart/types";
import { formatCLP } from "@/lib/utils";

const CHILE_REGIONS = [
  "Arica y Parinacota",
  "Tarapacá",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaíso",
  "Metropolitana",
  "O'Higgins",
  "Maule",
  "Ñuble",
  "Biobío",
  "La Araucanía",
  "Los Ríos",
  "Los Lagos",
  "Aysén",
  "Magallanes",
] as const;

export type CheckoutUser = {
  id: string;
  name: string;
  lastName: string | null;
  email: string;
  phone: string | null;
};

export interface CheckoutViewProps {
  cart: CartSummary;
  user: CheckoutUser | null;
  isLoggedIn: boolean;
}

const initial: ActionResult | null = null;

const inputClass =
  "mt-1 w-full rounded-lg border border-surface-border px-3 py-2 text-sm";

export function CheckoutView({ cart, user, isLoggedIn }: CheckoutViewProps) {
  const [state, formAction, pending] = useActionState(placeOrder, initial);
  const fullName = user
    ? [user.name, user.lastName].filter(Boolean).join(" ")
    : "";

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        {!isLoggedIn && (
          <Card>
            <h2 className="text-lg font-semibold text-ink">¿Ya tienes cuenta?</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Inicia sesión para que tus compras queden guardadas en{" "}
              <strong>Mis pedidos</strong>.
            </p>
            <div className="mt-4">
              <LoginForm callbackUrl="/tienda/checkout" />
            </div>
            <p className="mt-4 text-center text-sm text-ink-muted">
              ¿Primera vez?{" "}
              <Link
                href="/cuenta/registro?callbackUrl=/tienda/checkout"
                className="font-semibold text-milo-700 underline"
              >
                Crear cuenta
              </Link>
            </p>
          </Card>
        )}

        {isLoggedIn && user && (
          <Alert variant="info" title="Sesión iniciada" className="mt-0">
            Comprando como <strong>{fullName}</strong> ({user.email}).
          </Alert>
        )}

        <form action={formAction} className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-ink">Datos de contacto</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Obligatorios para coordinar el envío de tu pedido.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {!isLoggedIn ? (
                <>
                  <label className="block text-sm sm:col-span-2">
                    <span className="font-medium">Nombre</span>
                    <input
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      className={inputClass}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="font-medium">Correo</span>
                    <input
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className={inputClass}
                    />
                  </label>
                </>
              ) : (
                <input type="hidden" name="name" value={user?.name ?? ""} />
              )}
              <label className="block text-sm">
                <span className="font-medium">Teléfono</span>
                <input
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  defaultValue={user?.phone ?? ""}
                  className={inputClass}
                />
              </label>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-ink">Dirección de envío</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Todos los productos se despachan a domicilio.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm sm:col-span-2">
                <span className="font-medium">Calle y número</span>
                <input
                  name="street"
                  type="text"
                  required
                  autoComplete="street-address"
                  className={inputClass}
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium">Comuna</span>
                <input
                  name="commune"
                  type="text"
                  required
                  className={inputClass}
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium">Ciudad</span>
                <input
                  name="city"
                  type="text"
                  required
                  defaultValue="Santiago"
                  className={inputClass}
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium">Región</span>
                <select name="region" required className={inputClass} defaultValue="">
                  <option value="" disabled>
                    Selecciona región
                  </option>
                  {CHILE_REGIONS.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="font-medium">Código postal (opcional)</span>
                <input name="postalCode" type="text" className={inputClass} />
              </label>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-ink">
              Comentarios del pedido
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Indicaciones para la entrega, horarios preferidos u otras notas.
            </p>
            <label className="mt-4 block text-sm">
              <span className="sr-only">Comentarios</span>
              <textarea
                name="customerNotes"
                rows={3}
                maxLength={500}
                placeholder="Ej. dejar en conserjería, entregar después de las 18:00…"
                className={inputClass}
              />
            </label>
          </Card>

          <Card className="bg-milo-50">
            <h2 className="text-lg font-semibold text-ink">Confirmación</h2>
            <p className="mt-2 text-sm text-ink-muted">
              Al confirmar, tu pedido queda registrado y pagado. Prepararemos el
              envío a la dirección indicada. El pago en línea se activará más
              adelante; por ahora el cobro queda confirmado automáticamente.
            </p>
          </Card>

          {state && !state.ok && (
            <Alert variant="error" title="No se pudo confirmar" className="mt-0">
              {state.error}
            </Alert>
          )}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" variant="cta" disabled={pending}>
              {pending ? "Procesando compra..." : "Confirmar compra"}
            </Button>
            <Button href="/tienda/carrito" variant="ghost">
              Volver al carrito
            </Button>
          </div>
        </form>
      </div>

      <aside className="h-fit lg:sticky lg:top-24">
        <Card>
          <h2 className="text-lg font-semibold text-ink">Resumen</h2>
          <ul className="mt-4 space-y-3">
            {cart.items.map((item) => (
              <li key={item.productId} className="flex gap-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                  <ProductImage
                    src={item.thumbnail}
                    alt={item.title}
                    className="h-full w-full rounded-lg"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {item.title}
                  </p>
                  <p className="text-xs text-ink-muted">
                    {formatCLP(item.price)} × {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold text-ink">
                  {formatCLP(item.lineTotal)}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-surface-border pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-ink-muted">Subtotal</span>
              <span className="font-semibold text-ink">
                {formatCLP(cart.subtotal)}
              </span>
            </div>
            <div className="mt-2 flex justify-between">
              <span className="font-semibold text-ink">Total</span>
              <span className="text-xl font-bold text-milo-700">
                {formatCLP(cart.subtotal)}
              </span>
            </div>
          </div>
        </Card>
      </aside>
    </div>
  );
}
