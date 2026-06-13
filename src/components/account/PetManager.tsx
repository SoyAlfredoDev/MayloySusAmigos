"use client";

import { useActionState } from "react";
import type { PetSize, PetSpecies } from "@prisma/client";
import {
  addPetCoOwner,
  createUserPet,
  type PetRow,
} from "@/actions/account/pets";
import { AccountPageHeader } from "@/components/account";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { petSizeLabels, petSpeciesLabels } from "@/lib/booking/labels";

const speciesOptions: PetSpecies[] = ["DOG", "CAT", "BIRD", "RODENT", "OTHER"];
const sizeOptions: PetSize[] = ["TOY", "SMALL", "MEDIUM", "LARGE", "GIANT"];

export function PetManager({ initialPets }: { initialPets: PetRow[] }) {
  const [createState, createAction, createPending] = useActionState(
    createUserPet,
    null,
  );
  const [inviteState, inviteAction, invitePending] = useActionState(
    addPetCoOwner,
    null,
  );

  return (
    <div>
      <AccountPageHeader
        title="Mis mascotas"
        description="Registra mascotas y comparte el cuidado con otros tutores."
      />

      {createState && !createState.ok && (
        <Alert variant="error" title="Error" className="mb-4 mt-0">
          {createState.error}
        </Alert>
      )}

      <div className="mt-6 space-y-4">
        {initialPets.length === 0 && (
          <Card>
            <p className="text-sm text-ink-muted">
              Aún no tienes mascotas registradas. Agrega la primera abajo.
            </p>
          </Card>
        )}

        {initialPets.map((pet) => (
          <Card key={pet.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-ink">{pet.name}</h2>
                <p className="text-sm text-ink-muted">
                  {petSpeciesLabels[pet.species]}
                  {pet.breed ? ` · ${pet.breed}` : ""}
                  {pet.size ? ` · ${petSizeLabels[pet.size]}` : ""}
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  {pet.coOwners > 1
                    ? `${pet.coOwners} tutores vinculados`
                    : "1 tutor"}
                  {pet.isPrimary ? " · Tutor principal" : ""}
                </p>
              </div>
            </div>

            {pet.role === "OWNER" && (
              <form
                action={inviteAction}
                className="mt-4 flex flex-wrap items-end gap-2 border-t border-surface-border pt-4"
              >
                <input type="hidden" name="petId" value={pet.id} />
                <label className="min-w-[220px] flex-1 text-sm">
                  <span className="font-medium">Invitar co-tutor (correo)</span>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="otro@correo.cl"
                    className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2"
                  />
                </label>
                <Button type="submit" size="sm" disabled={invitePending}>
                  Vincular
                </Button>
              </form>
            )}

            {inviteState?.ok && (
              <p className="mt-2 text-sm text-milo-700">{inviteState.message}</p>
            )}
            {inviteState && !inviteState.ok && (
              <p className="mt-2 text-sm text-clinical-700">{inviteState.error}</p>
            )}
          </Card>
        ))}
      </div>

      <form action={createAction} className="card-milo mt-8 space-y-4">
        <h2 className="text-lg font-semibold text-ink">Nueva mascota</h2>
        <label className="block text-sm">
          <span className="font-medium">Nombre</span>
          <input
            name="name"
            required
            className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Especie</span>
          <select
            name="species"
            defaultValue="DOG"
            className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2"
          >
            {speciesOptions.map((s) => (
              <option key={s} value={s}>
                {petSpeciesLabels[s]}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium">Raza (opcional)</span>
          <input
            name="breed"
            className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Tamaño (peluquería)</span>
          <select
            name="size"
            className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2"
          >
            <option value="">Sin definir</option>
            {sizeOptions.map((s) => (
              <option key={s} value={s}>
                {petSizeLabels[s]}
              </option>
            ))}
          </select>
        </label>
        <Button type="submit" disabled={createPending}>
          {createPending ? "Guardando..." : "Agregar mascota"}
        </Button>
      </form>
    </div>
  );
}
