"use client";

import { useActionState } from "react";
import { addPetCoOwner, type PetRow } from "@/actions/account/pets";
import { AccountPageHeader } from "@/components/account";
import { ProductImage } from "@/components/shop/ProductImage";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { petSizeLabels, petSpeciesLabels } from "@/lib/booking/labels";

export function PetManager({ initialPets }: { initialPets: PetRow[] }) {
  const [inviteState, inviteAction, invitePending] = useActionState(
    addPetCoOwner,
    null,
  );

  return (
    <div>
      <AccountPageHeader
        title="Mis mascotas"
        description="Mascotas vinculadas a tu cuenta. El registro lo realiza el equipo Mailo."
      />

      <Alert variant="info" title="Registro de mascotas" className="mt-6">
        Solo los administradores pueden registrar mascotas nuevas. Si la tuya no
        aparece, contacta a la clínica para que la agreguen y vinculen a tu
        cuenta.
      </Alert>

      <div className="mt-6 space-y-4">
        {initialPets.length === 0 && (
          <Card>
            <p className="text-sm text-ink-muted">
              Aún no tienes mascotas vinculadas. Cuando Mailo registre la tuya,
              aparecerá aquí automáticamente.
            </p>
          </Card>
        )}

        {initialPets.map((pet) => (
          <Card key={pet.id}>
            <div className="flex flex-wrap gap-4">
              {pet.photoUrls.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {pet.photoUrls.map((url, index) => (
                    <div
                      key={url}
                      className="h-20 w-20 overflow-hidden rounded-lg border border-ink/10"
                    >
                      <ProductImage
                        src={url}
                        alt={`${pet.name} ${index + 1}`}
                        className="h-full w-full rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-surface-muted text-xs text-ink-muted">
                  Sin foto
                </div>
              )}

              <div className="min-w-0 flex-1">
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
    </div>
  );
}
