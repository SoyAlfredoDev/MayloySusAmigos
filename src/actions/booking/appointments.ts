"use server";

import { revalidatePath } from "next/cache";
import type { ServiceModule } from "@prisma/client";
import { db } from "@/lib/db";
import { getBookingUserId } from "@/lib/booking/session";
import {
  getAppointmentById,
  getUserAppointments,
} from "@/lib/booking/queries";
import type { BookingActionResult } from "@/actions/booking/types";
import type { AppointmentSummary } from "@/types/booking";

function revalidateBookingPaths() {
  revalidatePath("/veterinaria");
  revalidatePath("/peluqueria");
  revalidatePath("/cuenta/citas");
}

export async function createAppointment(input: {
  module: ServiceModule;
  petId: string;
  serviceId: string;
  professionalId: string;
  scheduledAt: string;
  notes?: string;
}): Promise<BookingActionResult<{ appointmentId: string }>> {
  const userId = await getBookingUserId();
  if (!userId) {
    return { ok: false, error: "Ingresa tus datos de contacto antes de confirmar." };
  }

  const scheduledAt = new Date(input.scheduledAt);
  if (Number.isNaN(scheduledAt.getTime())) {
    return { ok: false, error: "Horario inválido." };
  }

  const [pet, service, professional] = await Promise.all([
    db.pet.findFirst({
      where: { id: input.petId, userId, isActive: true },
      select: { id: true },
    }),
    db.service.findFirst({
      where: {
        id: input.serviceId,
        module: input.module,
        isActive: true,
      },
      select: { id: true, durationMinutes: true },
    }),
    db.professional.findFirst({
      where: {
        id: input.professionalId,
        module: input.module,
        isActive: true,
      },
      select: { id: true },
    }),
  ]);

  if (!pet) return { ok: false, error: "Mascota no encontrada." };
  if (!service) return { ok: false, error: "Servicio no disponible." };
  if (!professional) return { ok: false, error: "Profesional no disponible." };

  if (scheduledAt.getTime() <= Date.now()) {
    return { ok: false, error: "El horario seleccionado ya pasó." };
  }

  try {
    const appointment = await db.appointment.create({
      data: {
        userId,
        petId: input.petId,
        serviceId: input.serviceId,
        professionalId: input.professionalId,
        module: input.module,
        scheduledAt,
        durationMinutes: service.durationMinutes,
        status: "CONFIRMED",
        notes: input.notes?.trim() || null,
      },
      select: { id: true },
    });

    revalidateBookingPaths();

    return { ok: true, data: { appointmentId: appointment.id } };
  } catch {
    return {
      ok: false,
      error: "Ese horario ya no está disponible. Elige otro.",
    };
  }
}

export async function fetchUserAppointments(): Promise<AppointmentSummary[]> {
  const userId = await getBookingUserId();
  if (!userId) return [];
  return getUserAppointments(userId);
}

export async function fetchAppointment(
  id: string,
): Promise<AppointmentSummary | null> {
  const userId = await getBookingUserId();
  if (!userId) return null;
  return getAppointmentById(id, userId);
}

export async function cancelAppointment(
  appointmentId: string,
): Promise<BookingActionResult> {
  const userId = await getBookingUserId();
  if (!userId) return { ok: false, error: "Sesión no encontrada." };

  const appointment = await db.appointment.findFirst({
    where: { id: appointmentId, userId },
    select: { id: true, status: true, scheduledAt: true },
  });

  if (!appointment) return { ok: false, error: "Cita no encontrada." };
  if (appointment.status === "CANCELLED") {
    return { ok: false, error: "La cita ya está cancelada." };
  }
  if (appointment.status === "COMPLETED") {
    return { ok: false, error: "No puedes cancelar una cita completada." };
  }

  await db.appointment.update({
    where: { id: appointmentId },
    data: { status: "CANCELLED" },
  });

  revalidateBookingPaths();
  return { ok: true, message: "Cita cancelada." };
}
