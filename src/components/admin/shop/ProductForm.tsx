"use client";

import { useActionState } from "react";
import { createProduct } from "@/actions/shop/products";
import type { ActionResult } from "@/actions/shop/types";
import type { AdminCategoryRow } from "@/lib/shop/mappers";
import { CloudinaryImageUpload } from "@/components/admin/shop/CloudinaryImageUpload";
import { inputClass, petTypeOptions } from "@/lib/shop/form";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const initial: ActionResult | null = null;

export function ProductForm({ categories }: { categories: AdminCategoryRow[] }) {
  const [state, formAction, pending] = useActionState(createProduct, initial);

  return (
    <Card className="bg-surface">
      <h2 className="text-lg font-bold text-ink">Nuevo producto</h2>
      <form action={formAction} className="mt-6 grid gap-3 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-ink">Nombre</span>
          <input name="name" required className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-ink">Categoría</span>
          <select name="categoryId" defaultValue="" className={inputClass}>
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
          <select name="petType" defaultValue="ALL" className={inputClass}>
            {petTypeOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-ink">Precio (CLP)</span>
          <input name="price" type="number" min={1} required className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-ink">Stock</span>
          <input
            name="stock"
            type="number"
            min={0}
            defaultValue={0}
            className={inputClass}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-ink">Descripción corta</span>
          <input name="shortDescription" className={inputClass} />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-ink">Descripción</span>
          <textarea name="description" rows={3} className={inputClass} />
        </label>
        <div className="sm:col-span-2">
          <CloudinaryImageUpload />
        </div>
        <label className="flex items-center gap-2 sm:col-span-2">
          <input name="isFeatured" type="checkbox" className="h-4 w-4" />
          <span className="text-sm font-semibold text-ink">Destacado en inicio</span>
        </label>
        <div className="sm:col-span-2">
          <Button type="submit" variant="cta" disabled={pending}>
            {pending ? "Guardando..." : "Crear producto"}
          </Button>
        </div>
      </form>
      {state && !state.ok && (
        <p className="mt-3 text-sm text-clinical-600">{state.error}</p>
      )}
      {state?.ok && (
        <p className="mt-3 text-sm text-milo-700">{state.message}</p>
      )}
    </Card>
  );
}
