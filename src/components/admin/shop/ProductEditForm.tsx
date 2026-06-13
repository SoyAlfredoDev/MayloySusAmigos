"use client";

import { useActionState } from "react";
import { updateProduct } from "@/actions/shop/products";
import type { ActionResult } from "@/actions/shop/types";
import type { AdminCategoryRow, AdminProductRow } from "@/lib/shop/mappers";
import { inputClass, petTypeOptions } from "@/lib/shop/form";
import { Button } from "@/components/ui/Button";
import { CloudinaryImageUpload } from "@/components/admin/shop/CloudinaryImageUpload";

const initial: ActionResult | null = null;

export function ProductEditForm({
  product,
  categories,
}: {
  product: AdminProductRow;
  categories: AdminCategoryRow[];
}) {
  const [state, formAction, pending] = useActionState(updateProduct, initial);

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-2">
      <input type="hidden" name="id" value={product.id} />
      <label className="block sm:col-span-2">
        <span className="text-sm font-semibold text-ink">Nombre</span>
        <input
          name="name"
          required
          defaultValue={product.name}
          className={inputClass}
        />
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
        <select
          name="petType"
          defaultValue={product.petType}
          className={inputClass}
        >
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
      <div className="sm:col-span-2">
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Guardando..." : "Guardar cambios"}
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
