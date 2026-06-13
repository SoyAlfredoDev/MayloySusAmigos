"use server";

import { revalidatePath } from "next/cache";
import type { PetSize } from "@prisma/client";
import { userHasPetAccess } from "@/lib/auth/pets";
import { getCurrentUserId } from "@/lib/auth/session";
import { getUserPets } from "@/lib/booking/queries";
import { setBookingUserId } from "@/lib/booking/session";
import type { BookingActionResult } from "@/actions/booking/types";
import type { BookingPet } from "@/types/booking";

const sizeValues = new Set<PetSize>([
  "TOY",
  "SMALL",
  "MEDIUM",
  "LARGE",
  "GIANT",
]);

/** Invitado sin cuenta: guarda datos mínimos para continuar reserva. */
export async function resolveBookingGuest(
  _prev: BookingActionResult<{ userId: string }> | null,
  formData: FormData,
): Promise<BookingActionResult<{ userId: string }>> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Ingresa un correo válido." };
  }
  if (!name) return { ok: false, error: "Ingresa tu nombre." };
  if (!phone) return { ok: false, error: "Ingresa tu teléfono." };

  const { db } = await import("@/lib/db");
  const user = await db.user.upsert({
    where: { email },
    update: { name, phone },
    create: { email, name, phone },
    select: { id: true },
  });

  await setBookingUserId(user.id);
  return { ok: true, data: { userId: user.id } };
}

export async function fetchBookingPets(): Promise<BookingPet[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];
  return getUserPets(userId);
}

export async function createBookingPet(
  _prev: BookingActionResult<{ petId: string }> | null,
  _formData: FormData,
): Promise<BookingActionResult<{ petId: string }>> {
  return {
    ok: false,
    error:
      "Solo Mailo puede registrar mascotas. Si la tuya no aparece, contacta a la clínica.",
  };
}

export async function updatePetSize(
  petId: string,
  size: PetSize,
): Promise<BookingActionResult> {
  const userId = await getCurrentUserId();
  if (!userId) return { ok: false, error: "Sesión no encontrada." };
  if (!sizeValues.has(size)) return { ok: false, error: "Tamaño inválido." };

  const hasAccess = await userHasPetAccess(userId, petId);
  if (!hasAccess) return { ok: false, error: "Mascota no encontrada." };

  const { db } = await import("@/lib/db");
  await db.pet.update({
    where: { id: petId },
    data: { size },
  });

  return { ok: true };
}
