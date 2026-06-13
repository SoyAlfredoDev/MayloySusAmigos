"use client";

import {
  deleteProductAction,
  toggleProductActiveAction,
} from "@/actions/shop/products";
import type { AdminProductRow } from "@/lib/shop/mappers";
import { petTypeOptions } from "@/lib/shop/form";
import { cn, formatCLP } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProductImage } from "@/components/shop/ProductImage";

const petTypeLabel = Object.fromEntries(
  petTypeOptions.map((o) => [o.value, o.label]),
) as Record<string, string>;

function ProductActions({
  product,
  onEdit,
}: {
  product: AdminProductRow;
  onEdit: (product: AdminProductRow) => void;
}) {
  const handleDelete = () => {
    if (
      !window.confirm(
        `¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }
    const form = document.getElementById(
      `delete-product-${product.id}`,
    ) as HTMLFormElement | null;
    form?.requestSubmit();
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onEdit(product)}
      >
        Editar
      </Button>
      <form action={toggleProductActiveAction}>
        <input type="hidden" name="id" value={product.id} />
        <Button type="submit" variant="ghost" size="sm">
          {product.isActive ? "Deshabilitar" : "Habilitar"}
        </Button>
      </form>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-clinical-600"
        onClick={handleDelete}
      >
        Eliminar
      </Button>
      <form
        id={`delete-product-${product.id}`}
        action={deleteProductAction}
        className="hidden"
      >
        <input type="hidden" name="id" value={product.id} />
      </form>
    </div>
  );
}

export function ProductTable({
  products,
  onEdit,
}: {
  products: AdminProductRow[];
  onEdit: (product: AdminProductRow) => void;
}) {
  return (
    <div>
      <div className="border-b border-ink/10 px-6 py-5">
        <h2 className="text-lg font-bold text-ink">Productos</h2>
        <p className="mt-1 text-sm text-ink-muted">
          {products.length} en catálogo — gestiona precio, stock y visibilidad.
        </p>
      </div>

      {products.length === 0 ? (
        <p className="px-6 py-10 text-sm text-ink-muted">
          Sin productos. Usa &quot;Nuevo producto&quot; en la barra superior o ejecuta{" "}
          <code className="rounded bg-surface-muted px-1">npm run db:seed</code>
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 bg-surface-soft text-xs font-semibold uppercase tracking-wide text-ink-muted">
                <th className="px-6 py-3 font-semibold">Producto</th>
                <th className="px-4 py-3 font-semibold">Categoría</th>
                <th className="px-4 py-3 font-semibold">Precio</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-6 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className={cn(
                    "transition-colors hover:bg-surface-soft/80",
                    !product.isActive && "opacity-60",
                  )}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-ink/10">
                        <ProductImage
                          src={product.imageUrls[0] ?? null}
                          alt={product.name}
                          className="h-full w-full rounded-lg"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-ink">{product.name}</p>
                        <p className="text-xs text-ink-muted">
                          /{product.slug} · {petTypeLabel[product.petType]}
                        </p>
                        {product.isFeatured && (
                          <span className="mt-0.5 inline-block text-xs text-milo-600">
                            ★ Destacado
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-ink-muted">
                    {product.category?.name ?? "—"}
                  </td>
                  <td className="px-4 py-4 font-medium text-milo-700">
                    {formatCLP(product.price)}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={cn(
                        product.stock <= 5 && "font-semibold text-clinical-600",
                      )}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {product.isActive ? (
                      <Badge>Publicado</Badge>
                    ) : (
                      <span className="text-xs font-semibold text-ink-light">
                        Oculto
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <ProductActions product={product} onEdit={onEdit} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
