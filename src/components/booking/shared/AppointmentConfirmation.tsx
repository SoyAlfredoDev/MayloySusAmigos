"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import {
  appointmentStatusLabels,
  moduleLabels,
  petSpeciesLabels,
} from "@/lib/booking/labels";
import { formatAppointmentDate } from "@/lib/booking/timezone";
import { formatCLP } from "@/lib/utils";
import type { AppointmentSummary } from "@/types/booking";

export function AppointmentConfirmation({
  appointment,
}: {
  appointment: AppointmentSummary | null;
}) {
  if (!appointment) {
    return (
      <Alert variant="warning" title="Cita no encontrada" className="mt-0">
        <p>
          No pudimos cargar el detalle. Revisa{" "}
          <Link href="/cuenta/citas" className="font-medium underline">
            Mis citas
          </Link>
          .
        </p>
      </Alert>
    );
  }

  return (
    <div className="card-milo space-y-6">
      <div>
        <p className="badge-milo w-fit">Cita confirmada</p>
        <h1 className="mt-3 text-2xl font-bold text-ink">
          {moduleLabels[appointment.module]}
        </h1>
        <p className="mt-2 text-ink-muted">
          {formatAppointmentDate(new Date(appointment.scheduledAt))}
        </p>
      </div>

      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-ink-muted">Mascota</dt>
          <dd className="font-medium">
            {appointment.pet.name} ({petSpeciesLabels[appointment.pet.species]})
          </dd>
        </div>
        <div>
          <dt className="text-ink-muted">Servicio</dt>
          <dd className="font-medium">{appointment.service.name}</dd>
        </div>
        <div>
          <dt className="text-ink-muted">Profesional</dt>
          <dd className="font-medium">{appointment.professional.name}</dd>
        </div>
        <div>
          <dt className="text-ink-muted">Estado</dt>
          <dd className="font-medium">
            {appointmentStatusLabels[appointment.status]}
          </dd>
        </div>
        <div>
          <dt className="text-ink-muted">Duración</dt>
          <dd className="font-medium">{appointment.durationMinutes} min</dd>
        </div>
        <div>
          <dt className="text-ink-muted">Precio referencial</dt>
          <dd className="font-medium">{formatCLP(appointment.service.price)}</dd>
        </div>
      </dl>

      {appointment.notes && (
        <p className="text-sm text-ink-muted">
          <span className="font-medium text-ink">Notas: </span>
          {appointment.notes}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <Button href="/cuenta/citas">Ver mis citas</Button>
        <Button
          variant="ghost"
          href={
            appointment.module === "VETERINARY" ? "/veterinaria" : "/peluqueria"
          }
        >
          Agendar otra
        </Button>
      </div>
    </div>
  );
}
