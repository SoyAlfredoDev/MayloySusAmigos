import { ProductImage } from "@/components/shop/ProductImage";
import { Card } from "@/components/ui/Card";
import type { AdminPetRow } from "@/lib/admin/pets/queries";
import { petSpeciesLabels } from "@/lib/booking/labels";
import { siteConfig } from "@/config/site";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat(siteConfig.locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function AdminPetsList({ pets }: { pets: AdminPetRow[] }) {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-ink">Mascotas registradas</h2>
      <p className="mt-1 text-sm text-ink-muted">
        {pets.length} mascota(s) en el sistema.
      </p>

      {pets.length === 0 ? (
        <p className="mt-6 text-sm text-ink-muted">
          Aún no hay mascotas. Registra la primera arriba.
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {pets.map((pet) => (
            <li
              key={pet.id}
              className="flex flex-wrap gap-4 rounded-xl border border-surface-border bg-surface-soft p-4"
            >
              <div className="flex gap-2">
                {pet.photoUrls.length > 0 ? (
                  pet.photoUrls.slice(0, 4).map((url, index) => (
                    <div
                      key={url}
                      className="h-16 w-16 overflow-hidden rounded-lg border border-ink/10"
                    >
                      <ProductImage
                        src={url}
                        alt={`${pet.name} ${index + 1}`}
                        className="h-full w-full rounded-lg"
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-surface-muted text-xs text-ink-muted">
                    Sin foto
                  </div>
                )}
                {pet.photoUrls.length > 4 && (
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-milo-100 text-sm font-semibold text-milo-800">
                    +{pet.photoUrls.length - 4}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">{pet.name}</p>
                <p className="text-sm text-ink-muted">
                  {petSpeciesLabels[pet.species]}
                  {pet.breed ? ` · ${pet.breed}` : ""}
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  {pet.tutorCount} tutor(es) · Registrada {formatDate(pet.createdAt)}
                  {pet.photoUrls.length > 0 &&
                    ` · ${pet.photoUrls.length} foto(s)`}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
