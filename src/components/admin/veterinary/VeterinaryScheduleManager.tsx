"use client";

import { useActionState } from "react";
import { saveProfessionalWeeklySchedule } from "@/actions/admin/veterinary";
import type { ActionResult } from "@/actions/shop/types";
import type {
  AdminVetProfessional,
  AdminVetScheduleRow,
} from "@/lib/admin/veterinary/queries";
import { dayOfWeekLabels } from "@/lib/booking/labels";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const initial: ActionResult | null = null;

const defaultDay = {
  enabled: false,
  start: "09:00",
  end: "18:00",
  slot: 30,
};

type DayConfig = {
  enabled: boolean;
  start: string;
  end: string;
  slot: number;
};

function buildDayConfig(schedules: AdminVetScheduleRow[]): DayConfig[] {
  const days: DayConfig[] = Array.from({ length: 7 }, () => ({ ...defaultDay }));

  for (const row of schedules) {
    days[row.dayOfWeek] = {
      enabled: true,
      start: row.startTime,
      end: row.endTime,
      slot: row.slotMinutes,
    };
  }

  return days;
}

export function VeterinaryScheduleManager({
  professionals,
  schedulesByProfessional,
}: {
  professionals: AdminVetProfessional[];
  schedulesByProfessional: Record<string, AdminVetScheduleRow[]>;
}) {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-ink">
        Horarios por veterinario
      </h2>
      <p className="mt-1 text-sm text-ink-muted">
        Habilita los días de atención, el rango horario y el intervalo entre
        citas. Los clientes solo verán cupos dentro de esta configuración.
      </p>

      <div className="mt-6 space-y-6">
        {professionals.map((professional) => (
          <ProfessionalScheduleForm
            key={professional.id}
            professional={professional}
            schedules={schedulesByProfessional[professional.id] ?? []}
          />
        ))}
        {professionals.length === 0 && (
          <p className="text-sm text-ink-muted">
            No hay veterinarios registrados. Agrégalos en el seed o base de datos.
          </p>
        )}
      </div>
    </Card>
  );
}

function ProfessionalScheduleForm({
  professional,
  schedules,
}: {
  professional: AdminVetProfessional;
  schedules: AdminVetScheduleRow[];
}) {
  const [state, action, pending] = useActionState(
    saveProfessionalWeeklySchedule,
    initial,
  );
  const days = buildDayConfig(schedules);

  return (
    <div className="rounded-xl border-2 border-ink/10 bg-surface p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-ink">{professional.name}</h3>
          <p className="text-sm text-ink-muted">
            {professional.specialtyNames.join(" · ") || "Sin especialidad"}
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            {professional.scheduleCount > 0
              ? `${professional.scheduleCount} bloque(s) horario activo`
              : "Sin horarios configurados"}
          </p>
        </div>
        <span
          className={
            professional.isActive
              ? "rounded-pill bg-milo-100 px-2 py-1 text-xs font-semibold text-milo-800"
              : "rounded-pill bg-surface-muted px-2 py-1 text-xs font-semibold text-ink-muted"
          }
        >
          {professional.isActive ? "Activo" : "Inactivo"}
        </span>
      </div>

      <form action={action} className="mt-4 space-y-3">
        <input type="hidden" name="professionalId" value={professional.id} />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-surface-border text-xs uppercase tracking-wide text-ink-light">
                <th className="py-2 pr-3">Día</th>
                <th className="py-2 pr-3">Activo</th>
                <th className="py-2 pr-3">Desde</th>
                <th className="py-2 pr-3">Hasta</th>
                <th className="py-2">Intervalo (min)</th>
              </tr>
            </thead>
            <tbody>
              {days.map((day, index) => (
                <tr key={index} className="border-b border-surface-border/60">
                  <td className="py-2 pr-3 font-medium text-ink">
                    {dayOfWeekLabels[index]}
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      name={`day_${index}_enabled`}
                      type="checkbox"
                      defaultChecked={day.enabled}
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      name={`day_${index}_start`}
                      type="time"
                      defaultValue={day.start}
                      className="rounded-lg border border-surface-border px-2 py-1"
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      name={`day_${index}_end`}
                      type="time"
                      defaultValue={day.end}
                      className="rounded-lg border border-surface-border px-2 py-1"
                    />
                  </td>
                  <td className="py-2">
                    <input
                      name={`day_${index}_slot`}
                      type="number"
                      min={5}
                      step={5}
                      defaultValue={day.slot}
                      className="w-20 rounded-lg border border-surface-border px-2 py-1"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-ink-muted">
          El intervalo define cada cuántos minutos se ofrece un cupo (ej. 30 =
          09:00, 09:30, 10:00…). La duración de la cita viene del servicio
          elegido.
        </p>

        {state && !state.ok && (
          <Alert variant="error" title="Error" className="mt-0">
            {state.error}
          </Alert>
        )}
        {state?.ok && (
          <p className="text-xs font-semibold text-milo-700">{state.message}</p>
        )}

        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Guardando..." : `Guardar horarios de ${professional.name}`}
        </Button>
      </form>
    </div>
  );
}
