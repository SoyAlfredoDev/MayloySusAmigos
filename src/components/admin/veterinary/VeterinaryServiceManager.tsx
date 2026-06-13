"use client";

import { useActionState } from "react";
import { updateVeterinaryService } from "@/actions/admin/veterinary";
import type { ActionResult } from "@/actions/shop/types";
import type { AdminVetService } from "@/lib/admin/veterinary/queries";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatCLP } from "@/lib/utils";

const initial: ActionResult | null = null;

export function VeterinaryServiceManager({
  services,
}: {
  services: AdminVetService[];
}) {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-ink">Servicios y duración</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Define cuánto dura cada consulta y su precio. La duración determina los
        cupos disponibles en el agendamiento.
      </p>

      <ul className="mt-6 space-y-4">
        {services.map((service) => (
          <ServiceRow key={service.id} service={service} />
        ))}
      </ul>
    </Card>
  );
}

function ServiceRow({ service }: { service: AdminVetService }) {
  const [state, action, pending] = useActionState(updateVeterinaryService, initial);

  return (
    <li className="rounded-xl border border-surface-border bg-surface-soft p-4">
      <form action={action} className="space-y-3">
        <input type="hidden" name="id" value={service.id} />

        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-ink">{service.name}</p>
            {service.specialtyName && (
              <p className="text-xs text-milo-700">{service.specialtyName}</p>
            )}
            {service.description && (
              <p className="mt-1 text-sm text-ink-muted">{service.description}</p>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              name="isActive"
              type="checkbox"
              defaultChecked={service.isActive}
            />
            Activo
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block text-sm">
            <span className="font-medium">Duración (min)</span>
            <input
              name="durationMinutes"
              type="number"
              min={5}
              step={5}
              defaultValue={service.durationMinutes}
              required
              className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Precio (CLP)</span>
            <input
              name="price"
              type="number"
              min={0}
              step={500}
              defaultValue={service.price}
              required
              className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2"
            />
          </label>
          <div className="flex items-end">
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </div>

        <p className="text-xs text-ink-muted">
          Referencia actual: {service.durationMinutes} min ·{" "}
          {formatCLP(service.price)}
        </p>

        {state && !state.ok && (
          <Alert variant="error" title="Error" className="mt-0">
            {state.error}
          </Alert>
        )}
        {state?.ok && (
          <p className="text-xs font-semibold text-milo-700">{state.message}</p>
        )}
      </form>
    </li>
  );
}
