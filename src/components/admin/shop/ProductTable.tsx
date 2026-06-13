"use client";

import { useActionState, useState } from "react";
import {
  deleteProductAction,
  updateProduct,
} from "@/actions/shop/products";
import type { ActionResult } from "@/actions/shop/types";
import type { AdminCategoryRow, AdminProductRow } from "@/lib/shop/mappers";
import { inputClass, petTypeOptions } from "@/lib/shop/form";
import { formatCLP } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CloudinaryImageUpload } from "@/components/admin/shop/CloudinaryImageUpload";
import { ProductImage } from "@/components/shop/ProductImage";

const initial: ActionResult | null = null;

function ProductEditPanel({
  product,
  categories,
  onCancel,
}: {
  product: AdminProductRow;
  categories: AdminCategoryRow[];
  onCancel: () => void;
}) {
  const [state, formAction, pending] = useActionState(updateProduct, initial);

  return (
    <form
      action={formAction}
      className="mt-4 grid gap-3 rounded-lg border-2 border-milo-200 bg-milo-50 p-4 sm:grid-cols-2"
    >
      <input type="hidden" name="id" value={product.id} />
      <label className="block sm:col-span-2">
        <span className="text-sm font-semibold text-ink">Nombre</span>
        <input name="name" required defaultValue={product.name} className={inputClass} />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-ink">Categoría</span>
        <select
          name="categoryId"
          defaultValue={product.categoryId ?? ""}
          className={inputClass}
        >
          <option value="">Sin categoría</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-ink">Tipo mascota</span>
        <select name="petType" defaultValue={product.petType} className={inputClass}>
          {petTypeOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-ink">Precio (CLP)</span>
        <input
          name="price"
          type="number"
          min={1}
          required
          defaultValue={product.price}
          className={inputClass}
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-ink">Stock</span>
        <input
          name="stock"
          type="number"
          min={0}
          defaultValue={product.stock}
          className={inputClass}
        />
      </label>
      <label className="block sm:col-span-2">
        <span className="text-sm font-semibold text-ink">Descripción corta</span>
        <input
          name="shortDescription"
          defaultValue={product.shortDescription ?? ""}
          className={inputClass}
        />
      </label>
      <label className="block sm:col-span-2">
        <span className="text-sm font-semibold text-ink">Descripción</span>
        <textarea
          name="description"
          rows={3}
          defaultValue={product.description ?? ""}
          className={inputClass}
        />
      </label>
      <div className="sm:col-span-2">
        <CloudinaryImageUpload defaultUrls={product.imageUrls} />
      </div>
      <label className="flex items-center gap-2">
        <input
          name="isFeatured"
          type="checkbox"
          defaultChecked={product.isFeatured}
          className="h-4 w-4"
        />
        <span className="text-sm font-semibold text-ink">Destacado</span>
      </label>
      <label className="flex items-center gap-2">
        <input
          name="isActive"
          type="checkbox"
          defaultChecked={product.isActive}
          className="h-4 w-4"
        />
        <span className="text-sm font-semibold text-ink">Publicado en tienda</span>
      </label>
      <div className="flex flex-wrap gap-2 sm:col-span-2">
        <Button type="submit" variant="primary" size="sm" disabled={pending}>
          {pending ? "Guardando..." : "Guardar cambios"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
      {state && !state.ok && (
        <p className="text-sm text-clinical-600 sm:col-span-2">{state.error}</p>
      )}
      {state?.ok && (
        <p className="text-sm text-milo-700 sm:col-span-2">{state.message}</p>
      )}
    </form>
  );
}

function ProductRow({
  product,
  categories,
}: {
  product: AdminProductRow;
  categories: AdminCategoryRow[];
}) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="border-b border-ink/5 py-4 last:border-0">
      <div className="flex gap-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg">
          <ProductImage
            src={product.imageUrls[0] ?? null}
            alt={product.name}
            className="h-full w-full rounded-lg"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-ink">{product.name}</p>
              <p className="text-xs text-ink-muted">
                {product.category?.name ?? "Sin categoría"} · /{product.slug}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setEditing((v) => !v)}
              >
                {editing ? "Cerrar" : "Editar"}
              </Button>
              <form action={deleteProductAction}>
                <input type="hidden" name="id" value={product.id} />
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="text-clinical-600"
                >
                  Eliminar
                </Button>
              </form>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
            <span className="font-medium text-milo-700">
              {formatCLP(product.price)}
            </span>
            <span className="text-ink-muted">Stock: {product.stock}</span>
            {product.isActive ? (
              <Badge>Publicado</Badge>
            ) : (
              <span className="text-xs font-semibold text-ink-light">Oculto</span>
            )}
            {product.isFeatured && (
              <span className="text-xs text-milo-600">★ Destacado</span>
            )}
          </div>
        </div>
      </div>
      {editing && (
        <ProductEditPanel
          product={product}
          categories={categories}
          onCancel={() => setEditing(false)}
        />
      )}
    </div>
  );
}

export function ProductTable({
  products,
  categories,
}: {
  products: AdminProductRow[];
  categories: AdminCategoryRow[];
}) {
  return (
    <Card className="bg-surface">
      <h2 className="text-lg font-bold text-ink">Productos</h2>
      <p className="mt-1 text-sm text-ink-muted">
        {products.length} en catálogo — crear, editar y eliminar.
      </p>

      <div className="mt-6">
        {products.map((product) => (
          <ProductRow
            key={product.id}
            product={product}
            categories={categories}
          />
        ))}
        {products.length === 0 && (
          <p className="py-6 text-sm text-ink-muted">
            Sin productos. Crea uno arriba o ejecuta{" "}
            <code className="rounded bg-surface-muted px-1">npm run db:seed</code>
          </p>
        )}
      </div>
    </Card>
  );
}
