"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  fetchAvailableSlots,
  fetchProfessionalSchedules,
} from "@/actions/booking/availability";
import { dayOfWeekShortLabels } from "@/lib/booking/labels";
import {
  addDaysYmd,
  formatAppointmentDate,
  getZonedParts,
  todayYmd,
  zonedDateTimeToUtc,
} from "@/lib/booking/timezone";
import { cn } from "@/lib/utils";
import type { ProfessionalScheduleDay } from "@/lib/booking/queries";
import type { AvailableSlot } from "@/types/booking";

export interface SchedulePickerProps {
  professionalId: string | null;
  serviceId: string | null;
  serviceDurationMinutes?: number;
  dateYmd: string;
  scheduledAt: string | null;
  onDateChange: (dateYmd: string) => void;
  onSlotChange: (startAt: string | null) => void;
  accent?: "milo" | "clinical";
}

function formatDateChip(dateYmd: string): string {
  const date = zonedDateTimeToUtc(dateYmd, "12:00");
  return new Intl.DateTimeFormat("es-CL", {
    timeZone: "America/Santiago",
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}

function buildBookableDates(
  schedules: ProfessionalScheduleDay[],
  maxDays = 42,
): string[] {
  const activeDays = new Set(schedules.map((row) => row.dayOfWeek));
  if (activeDays.size === 0) return [];

  const dates: string[] = [];
  let cursor = todayYmd();

  for (let i = 0; i < maxDays; i += 1) {
    const { dayOfWeek } = getZonedParts(zonedDateTimeToUtc(cursor, "12:00"));
    if (activeDays.has(dayOfWeek)) {
      dates.push(cursor);
    }
    cursor = addDaysYmd(cursor, 1);
  }

  return dates;
}

function groupSlots(slots: AvailableSlot[]) {
  const morning: AvailableSlot[] = [];
  const afternoon: AvailableSlot[] = [];

  for (const slot of slots) {
    const { hour } = getZonedParts(new Date(slot.startAt));
    if (hour < 12) morning.push(slot);
    else afternoon.push(slot);
  }

  return { morning, afternoon };
}

export function SchedulePicker({
  professionalId,
  serviceId,
  serviceDurationMinutes,
  dateYmd,
  scheduledAt,
  onDateChange,
  onSlotChange,
  accent = "milo",
}: SchedulePickerProps) {
  const [isPending, startTransition] = useTransition();
  const [schedules, setSchedules] = useState<ProfessionalScheduleDay[]>([]);
  const [slots, setSlots] = useState<AvailableSlot[]>([]);

  const bookableDates = useMemo(
    () => buildBookableDates(schedules),
    [schedules],
  );

  const { morning, afternoon } = useMemo(() => groupSlots(slots), [slots]);

  const selectedSlotLabel = scheduledAt
    ? formatAppointmentDate(new Date(scheduledAt))
    : null;

  useEffect(() => {
    if (!professionalId) {
      setSchedules([]);
      return;
    }

    startTransition(async () => {
      const result = await fetchProfessionalSchedules(professionalId);
      setSchedules(result.ok && result.data ? result.data : []);
    });
  }, [professionalId]);

  useEffect(() => {
    if (!professionalId || !serviceId || !dateYmd) {
      setSlots([]);
      return;
    }

    startTransition(async () => {
      const result = await fetchAvailableSlots({
        professionalId,
        serviceId,
        dateYmd,
      });
      const nextSlots = result.ok && result.data ? result.data : [];
      setSlots(nextSlots);
      if (
        scheduledAt &&
        !nextSlots.some((slot) => slot.startAt === scheduledAt)
      ) {
        onSlotChange(null);
      }
    });
  }, [professionalId, serviceId, dateYmd]);

  const accentSelected =
    accent === "clinical"
      ? "bg-clinical-500 text-white"
      : "bg-milo-500 text-white";
  const accentRing =
    accent === "clinical" ? "ring-clinical-200" : "ring-milo-200";

  if (!professionalId || !serviceId) {
    return (
      <p className="text-sm text-ink-muted">
        Selecciona un profesional y un servicio para ver horarios.
      </p>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-ink/15 bg-surface-muted p-4 text-sm text-ink-muted">
        Este profesional aún no tiene días habilitados. El equipo de Mailo puede
        configurarlos desde el panel de administración.
      </div>
    );
  }

  const activeDayLabels = [
    ...new Set(schedules.map((row) => dayOfWeekShortLabels[row.dayOfWeek])),
  ].join(", ");

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-surface-muted px-4 py-3 text-sm text-ink-muted">
        <p>
          <span className="font-semibold text-ink">Días de atención:</span>{" "}
          {activeDayLabels}
        </p>
        {serviceDurationMinutes && (
          <p className="mt-1">
            Cada cita dura aproximadamente{" "}
            <span className="font-semibold text-ink">
              {serviceDurationMinutes} minutos
            </span>
            .
          </p>
        )}
      </div>

      <div>
        <p className="text-sm font-semibold text-ink">Próximas fechas</p>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {bookableDates.slice(0, 14).map((date) => (
            <button
              key={date}
              type="button"
              onClick={() => {
                onDateChange(date);
                onSlotChange(null);
              }}
              className={cn(
                "shrink-0 rounded-pill border px-3 py-2 text-sm font-medium transition-colors",
                dateYmd === date
                  ? cn(accentSelected, "border-transparent")
                  : "border-surface-border bg-white text-ink hover:border-milo-300",
              )}
            >
              {formatDateChip(date)}
            </button>
          ))}
        </div>
      </div>

      <label className="block text-sm">
        <span className="font-semibold text-ink">O elige otra fecha</span>
        <input
          type="date"
          value={dateYmd}
          min={todayYmd()}
          max={addDaysYmd(todayYmd(), 60)}
          onChange={(event) => {
            onDateChange(event.target.value);
            onSlotChange(null);
          }}
          className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2"
        />
      </label>

      <div>
        <p className="text-sm font-semibold text-ink">Horarios disponibles</p>
        {isPending && (
          <p className="mt-2 text-sm text-ink-muted">Buscando horarios...</p>
        )}
        {!isPending && slots.length === 0 && (
          <p className="mt-2 text-sm text-ink-muted">
            No hay cupos para esta fecha. Prueba otro día de la lista.
          </p>
        )}

        {!isPending && slots.length > 0 && (
          <div className="mt-3 space-y-4">
            {morning.length > 0 && (
              <SlotGroup
                title="Mañana"
                slots={morning}
                scheduledAt={scheduledAt}
                onSelect={onSlotChange}
                accentSelected={accentSelected}
                accentRing={accentRing}
              />
            )}
            {afternoon.length > 0 && (
              <SlotGroup
                title="Tarde"
                slots={afternoon}
                scheduledAt={scheduledAt}
                onSelect={onSlotChange}
                accentSelected={accentSelected}
                accentRing={accentRing}
              />
            )}
          </div>
        )}
      </div>

      {selectedSlotLabel && (
        <div
          className={cn(
            "rounded-xl border-2 px-4 py-3 text-sm",
            accent === "clinical"
              ? "border-clinical-200 bg-clinical-100/40"
              : "border-milo-200 bg-milo-50",
          )}
        >
          <span className="font-semibold text-ink">Horario elegido: </span>
          <span className="text-ink-muted">{selectedSlotLabel}</span>
        </div>
      )}
    </div>
  );
}

function SlotGroup({
  title,
  slots,
  scheduledAt,
  onSelect,
  accentSelected,
  accentRing,
}: {
  title: string;
  slots: AvailableSlot[];
  scheduledAt: string | null;
  onSelect: (startAt: string) => void;
  accentSelected: string;
  accentRing: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-light">
        {title}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {slots.map((slot) => (
          <button
            key={slot.startAt}
            type="button"
            onClick={() => onSelect(slot.startAt)}
            className={cn(
              "rounded-pill border px-4 py-2 text-sm font-semibold transition-all",
              scheduledAt === slot.startAt
                ? cn(accentSelected, "border-transparent ring-2", accentRing)
                : "border-surface-border bg-white text-ink hover:border-milo-300",
            )}
          >
            {slot.label}
          </button>
        ))}
      </div>
    </div>
  );
}
