import type { Schedule } from "@prisma/client";
import {
  formatSlotLabel,
  getZonedParts,
  zonedDateTimeToUtc,
} from "@/lib/booking/timezone";
import type { AvailableSlot } from "@/types/booking";

const ACTIVE_STATUSES = new Set(["PENDING", "CONFIRMED"]);

type BusyInterval = { start: Date; end: Date };

function parseHm(value: string): { hour: number; minute: number } {
  const [hour, minute] = value.split(":").map(Number);
  return { hour, minute };
}

function overlaps(
  slotStart: Date,
  slotEnd: Date,
  busy: BusyInterval,
): boolean {
  return slotStart < busy.end && slotEnd > busy.start;
}

function generateDaySlots(
  dateYmd: string,
  schedule: Schedule,
  durationMinutes: number,
): Date[] {
  const { hour: startHour, minute: startMinute } = parseHm(schedule.startTime);
  const { hour: endHour, minute: endMinute } = parseHm(schedule.endTime);
  const step = schedule.slotMinutes;

  const dayStart = zonedDateTimeToUtc(
    dateYmd,
    `${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`,
  );
  const dayEnd = zonedDateTimeToUtc(
    dateYmd,
    `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`,
  );

  const slots: Date[] = [];
  let cursor = dayStart;

  while (cursor.getTime() + durationMinutes * 60_000 <= dayEnd.getTime()) {
    slots.push(new Date(cursor));
    cursor = new Date(cursor.getTime() + step * 60_000);
  }

  return slots;
}

export function computeAvailableSlots(input: {
  dateYmd: string;
  durationMinutes: number;
  schedule: Schedule | null;
  appointments: { scheduledAt: Date; durationMinutes: number; status: string }[];
  blockedSlots: { startAt: Date; endAt: Date }[];
  now?: Date;
}): AvailableSlot[] {
  const { dateYmd, durationMinutes, schedule, appointments, blockedSlots } =
    input;
  const now = input.now ?? new Date();

  if (!schedule) return [];

  const { dayOfWeek } = getZonedParts(zonedDateTimeToUtc(dateYmd, "12:00"));
  if (schedule.dayOfWeek !== dayOfWeek) return [];

  const busyFromAppointments: BusyInterval[] = appointments
    .filter((appt) => ACTIVE_STATUSES.has(appt.status))
    .map((appt) => ({
      start: appt.scheduledAt,
      end: new Date(appt.scheduledAt.getTime() + appt.durationMinutes * 60_000),
    }));

  const busyFromBlocks: BusyInterval[] = blockedSlots.map((block) => ({
    start: block.startAt,
    end: block.endAt,
  }));

  const busy = [...busyFromAppointments, ...busyFromBlocks];
  const candidates = generateDaySlots(dateYmd, schedule, durationMinutes);

  return candidates
    .filter((start) => {
      const end = new Date(start.getTime() + durationMinutes * 60_000);
      if (start.getTime() <= now.getTime()) return false;
      return !busy.some((interval) => overlaps(start, end, interval));
    })
    .map((start) => ({
      startAt: start.toISOString(),
      label: formatSlotLabel(start),
    }));
}
