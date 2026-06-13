"use server";

import { getAvailableSlotsForBooking } from "@/lib/booking/queries";
import type { AvailableSlot } from "@/types/booking";
import type { BookingActionResult } from "@/actions/booking/types";

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
