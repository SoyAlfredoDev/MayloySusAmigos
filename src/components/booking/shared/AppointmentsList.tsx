"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cancelAppointment } from "@/actions/booking/appointments";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  appointmentStatusLabels,
  moduleLabels,
  petSpeciesLabels,
} from "@/lib/booking/labels";
import { formatAppointmentDate } from "@/lib/booking/timezone";
import { formatCLP } from "@/lib/utils";
import type { AppointmentSummary } from "@/types/booking";

export function AppointmentsList({
  appointments,
}: {
  appointments: AppointmentSummary[];
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (appointments.length === 0) {
    return (
      <Card className="mt-6">
        <p className="font-medium text-ink">Aún no tienes citas</p>
        <p className="mt-2 text-sm text-ink-muted">
          Agenda en{" "}
          <Link href="/veterinaria" className="font-medium text-milo-700 underline">
            Veterinaria
          </Link>{" "}
          o{" "}
          <Link href="/peluqueria" className="font-medium text-milo-700 underline">
            Peluquería
          </Link>
          .
        </p>
      </Card>
    );
  }

  function handleCancel(id: string) {
    startTransition(async () => {
      await cancelAppointment(id);
      router.refresh();
    });
  }

  return (
    <div className="mt-6 space-y-4">
      {appointments.map((appointment) => {
        const canCancel =
          appointment.status === "PENDING" ||
          appointment.status === "CONFIRMED";

        return (
          <Card key={appointment.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-milo-700">
                  {moduleLabels[appointment.module]}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-ink">
                  {appointment.service.name}
                </h2>
                <p className="mt-1 text-sm text-ink-muted">
                  {formatAppointmentDate(new Date(appointment.scheduledAt))}
                </p>
              </div>
              <span className="rounded-pill bg-surface-muted px-3 py-1 text-sm font-medium">
                {appointmentStatusLabels[appointment.status]}
              </span>
            </div>

            <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-ink-muted">Mascota</dt>
                <dd>
                  {appointment.pet.name} (
                  {petSpeciesLabels[appointment.pet.species]})
                </dd>
              </div>
              <div>
                <dt className="text-ink-muted">Profesional</dt>
                <dd>{appointment.professional.name}</dd>
              </div>
              <div>
                <dt className="text-ink-muted">Precio</dt>
                <dd>{formatCLP(appointment.service.price)}</dd>
              </div>
            </dl>

            {canCancel && (
              <div className="mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isPending}
                  onClick={() => handleCancel(appointment.id)}
                >
                  Cancelar cita
                </Button>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
