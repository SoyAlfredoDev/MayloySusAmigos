"use client";

import { useActionState } from "react";
import type { PetSex, PetSize, PetSpecies } from "@prisma/client";
import { createAdminPet } from "@/actions/admin/pets";
import type { ActionResult } from "@/actions/shop/types";
import { CloudinaryImageUpload } from "@/components/admin/shop/CloudinaryImageUpload";
import type { AdminUserOption } from "@/lib/admin/pets/queries";
import { petSizeLabels, petSpeciesLabels } from "@/lib/booking/labels";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const speciesOptions: PetSpecies[] = ["DOG", "CAT", "BIRD", "RODENT", "OTHER"];
const sizeOptions: PetSize[] = ["TOY", "SMALL", "MEDIUM", "LARGE", "GIANT"];
const sexOptions: { value: PetSex; label: string }[] = [
  { value: "UNKNOWN", label: "Sin especificar" },
  { value: "MALE", label: "Macho" },
  { value: "FEMALE", label: "Hembra" },
];

const initial: ActionResult | null = null;

const inputClass =
  "mt-1 w-full rounded-lg border border-surface-border px-3 py-2 text-sm";

export function AdminPetForm({ users }: { users: AdminUserOption[] }) {
  const [state, action, pending] = useActionState(createAdminPet, initial);

  return (
    <Card>
      <h2 className="text-lg font-semibold text-ink">Registrar mascota</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Solo administradores pueden crear mascotas. Opcionalmente vincula un
        tutor al guardar.
      </p>

      <form action={action} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">
            <span className="font-medium">Nombre</span>
            <input name="name" required className={inputClass} />
          </label>

          <label className="block text-sm">
            <span className="font-medium">Especie</span>
            <select
              name="species"
              defaultValue="DOG"
              required
              className={inputClass}
            >
              {speciesOptions.map((species) => (
                <option key={species} value={species}>
                  {petSpeciesLabels[species]}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="font-medium">Sexo</span>
            <select name="sex" defaultValue="UNKNOWN" className={inputClass}>
              {sexOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="font-medium">Raza (opcional)</span>
            <input name="breed" className={inputClass} />
          </label>

          <label className="block text-sm">
            <span className="font-medium">Color (opcional)</span>
            <input name="color" className={inputClass} />
          </label>

          <label className="block text-sm">
            <span className="font-medium">Tamaño</span>
            <select name="size" className={inputClass} defaultValue="">
              <option value="">Sin definir</option>
              {sizeOptions.map((size) => (
                <option key={size} value={size}>
                  {petSizeLabels[size]}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="font-medium">Peso (kg, opcional)</span>
            <input
              name="weightKg"
              type="number"
              min={0}
              step={0.1}
              className={inputClass}
            />
          </label>

          <label className="block text-sm sm:col-span-2">
            <span className="font-medium">Tutor principal (opcional)</span>
            <select name="ownerUserId" className={inputClass} defaultValue="">
              <option value="">Sin vincular aún</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {[user.name, user.lastName].filter(Boolean).join(" ")} ·{" "}
                  {user.email}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm sm:col-span-2">
            <span className="font-medium">Notas internas (opcional)</span>
            <textarea
              name="notes"
              rows={2}
              className={inputClass}
              placeholder="Alergias, temperamento, cuidados..."
            />
          </label>
        </div>

        <CloudinaryImageUpload
          name="photoUrls"
          label="Fotos de la mascota"
          folder="mailo/mascotas"
          maxFiles={10}
          helperText="Agrega todas las fotos que necesites. Puedes subir varias veces."
        />

        {state && !state.ok && (
          <Alert variant="error" title="Error" className="mt-0">
            {state.error}
          </Alert>
        )}
        {state?.ok && (
          <Alert variant="info" title="Listo" className="mt-0">
            {state.message}
          </Alert>
        )}

        <Button type="submit" disabled={pending}>
          {pending ? "Guardando..." : "Registrar mascota"}
        </Button>
      </form>
    </Card>
  );
}
