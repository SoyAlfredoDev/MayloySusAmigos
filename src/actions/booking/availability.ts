"use server";

import {
  getAvailableSlotsForBooking,
  getProfessionalSchedules,
} from "@/lib/booking/queries";
import type { AvailableSlot } from "@/types/booking";
import type { BookingActionResult } from "@/actions/booking/types";
import type { ProfessionalScheduleDay } from "@/lib/booking/queries";

export async function fetchAvailableSlots(input: {
  professionalId: string;
  serviceId: string;
  dateYmd: string;
}): Promise<BookingActionResult<AvailableSlot[]>> {
  if (!input.professionalId || !input.serviceId || !input.dateYmd) {
    return { ok: false, error: "Faltan datos para buscar horarios." };
  }

  try {
    const slots = await getAvailableSlotsForBooking(input);
    return { ok: true, data: slots };
  } catch {
    return { ok: false, error: "No se pudieron cargar los horarios." };
  }
}

export async function fetchProfessionalSchedules(
  professionalId: string,
): Promise<BookingActionResult<ProfessionalScheduleDay[]>> {
  if (!professionalId) {
    return { ok: false, error: "Profesional no válido." };
  }

  try {
    const schedules = await getProfessionalSchedules(professionalId);
    return { ok: true, data: schedules };
  } catch {
    return { ok: false, error: "No se pudieron cargar los horarios." };
  }
}
