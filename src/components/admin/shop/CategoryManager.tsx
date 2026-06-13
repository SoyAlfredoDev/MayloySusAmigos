"use client";

import { useActionState, useState } from "react";
import {
  createCategory,
  deleteCategoryAction,
  updateCategory,
} from "@/actions/shop/categories";
import type { ActionResult } from "@/actions/shop/types";
import type { AdminCategoryRow } from "@/lib/shop/mappers";
import { inputClass, petTypeOptions } from "@/lib/shop/form";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const initial: ActionResult | null = null;

function CategoryEditForm({
  category,
  onCancel,
}: {
  category: AdminCategoryRow;
  onCancel: () => void;
}) {
  const [state, formAction, pending] = useActionState(updateCategory, initial);

  return (
    <form action={formAction} className="mt-3 grid gap-3 rounded-lg bg-milo-50 p-4">
      <input type="hidden" name="id" value={category.id} />
      <label className="block">
        <span className="text-sm font-semibold text-ink">Nombre</span>
        <input
          name="name"
          required
          defaultValue={category.name}
          className={inputClass}
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-ink">Descripción</span>
        <input
          name="description"
          defaultValue={category.description ?? ""}
          className={inputClass}
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-ink">Tipo mascota</span>
          <select
            name="petType"
            defaultValue={category.petType}
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
          <span className="text-sm font-semibold text-ink">Orden</span>
          <input
            name="sortOrder"
            type="number"
            defaultValue={category.sortOrder}
            className={inputClass}
          />
        </label>
      </div>
      <label className="flex items-center gap-2">
        <input
          name="isActive"
          type="checkbox"
          defaultChecked={category.isActive}
          className="h-4 w-4"
        />
        <span className="text-sm font-semibold text-ink">Activa en tienda</span>
      </label>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" variant="primary" size="sm" disabled={pending}>
          {pending ? "Guardando..." : "Guardar cambios"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
      {state && !state.ok && (
        <p className="text-sm text-clinical-600">{state.error}</p>
      )}
      {state?.ok && (
        <p className="text-sm text-milo-700">{state.message}</p>
      )}
    </form>
  );
}

function CategoryRow({ category }: { category: AdminCategoryRow }) {
  const [editing, setEditing] = useState(false);

  return (
    <li className="py-3 first:pt-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-ink">
            {category.name}
            {!category.isActive && (
              <span className="ml-2 text-xs text-ink-light">(oculta)</span>
            )}
          </p>
          <p className="text-xs text-ink-muted">
            {category._count.products} producto(s) · orden {category.sortOrder}{" "}
            · /{category.slug}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setEditing((v) => !v)}
          >
            {editing ? "Cerrar" : "Editar"}
          </Button>
          <form action={deleteCategoryAction}>
            <input type="hidden" name="id" value={category.id} />
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
      {editing && (
        <CategoryEditForm
          category={category}
          onCancel={() => setEditing(false)}
        />
      )}
    </li>
  );
}

export function CategoryManager({ categories }: { categories: AdminCategoryRow[] }) {
  const [state, formAction, pending] = useActionState(createCategory, initial);

  return (
    <Card className="bg-surface">
      <h2 className="text-lg font-bold text-ink">Categorías</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Crear, editar y eliminar categorías del catálogo.
      </p>

      <form action={formAction} className="mt-6 grid gap-3 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-ink">Nombre</span>
          <input
            name="name"
            required
            className={inputClass}
            placeholder="Ej. Alimentos"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-ink">Descripción</span>
          <input
            name="description"
            className={inputClass}
            placeholder="Opcional"
          />
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
          <span className="text-sm font-semibold text-ink">Orden</span>
          <input
            name="sortOrder"
            type="number"
            defaultValue={0}
            className={inputClass}
          />
        </label>
        <div className="flex items-end sm:col-span-2">
          <Button type="submit" variant="primary" disabled={pending}>
            {pending ? "Guardando..." : "Agregar categoría"}
          </Button>
        </div>
      </form>

      {state && !state.ok && (
        <p className="mt-3 text-sm text-clinical-600">{state.error}</p>
      )}
      {state?.ok && (
        <p className="mt-3 text-sm text-milo-700">{state.message}</p>
      )}

      <ul className="mt-6 divide-y divide-ink/10">
        {categories.map((cat) => (
          <CategoryRow key={cat.id} category={cat} />
        ))}
        {categories.length === 0 && (
          <li className="py-4 text-sm text-ink-muted">Sin categorías aún.</li>
        )}
      </ul>
    </Card>
  );
}
