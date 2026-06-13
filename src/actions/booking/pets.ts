"use server";

import { revalidatePath } from "next/cache";
import type { PetSize, PetSpecies } from "@prisma/client";
import { db } from "@/lib/db";
import {
  getBookingUserId,
  setBookingUserId,
} from "@/lib/booking/session";
import { getUserPets } from "@/lib/booking/queries";
import type { BookingActionResult } from "@/actions/booking/types";
import type { BookingPet } from "@/types/booking";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const speciesValues = new Set<PetSpecies>([
  "DOG",
  "CAT",
  "BIRD",
  "RODENT",
  "OTHER",
]);

const sizeValues = new Set<PetSize>([
  "TOY",
  "SMALL",
  "MEDIUM",
  "LARGE",
  "GIANT",
]);

export async function resolveBookingOwner(
  _prev: BookingActionResult<{ userId: string }> | null,
  formData: FormData,
): Promise<BookingActionResult<{ userId: string }>> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!email || !isValidEmail(email)) {
    return { ok: false, error: "Ingresa un correo válido." };
  }
  if (!name) return { ok: false, error: "Ingresa tu nombre." };
  if (!phone) return { ok: false, error: "Ingresa tu teléfono." };

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
  const userId = await getBookingUserId();
  if (!userId) return [];
  return getUserPets(userId);
}

export async function createBookingPet(
  _prev: BookingActionResult<{ petId: string }> | null,
  formData: FormData,
): Promise<BookingActionResult<{ petId: string }>> {
  const userId = await getBookingUserId();
  if (!userId) {
    return {
      ok: false,
      error: "Primero ingresa tus datos de contacto.",
    };
  }

  const name = String(formData.get("name") ?? "").trim();
  const species = String(formData.get("species") ?? "") as PetSpecies;
  const breed = String(formData.get("breed") ?? "").trim() || null;
  const sizeRaw = String(formData.get("size") ?? "").trim();
  const size = sizeRaw && sizeValues.has(sizeRaw as PetSize)
    ? (sizeRaw as PetSize)
    : null;

  if (!name) return { ok: false, error: "El nombre de la mascota es obligatorio." };
  if (!speciesValues.has(species)) {
    return { ok: false, error: "Selecciona una especie válida." };
  }

  const pet = await db.pet.create({
    data: {
      userId,
      name,
      species,
      breed,
      size,
    },
    select: { id: true },
  });

  revalidatePath("/cuenta/mascotas");

  return { ok: true, data: { petId: pet.id } };
}

export async function updatePetSize(
  petId: string,
  size: PetSize,
): Promise<BookingActionResult> {
  const userId = await getBookingUserId();
  if (!userId) return { ok: false, error: "Sesión no encontrada." };
  if (!sizeValues.has(size)) return { ok: false, error: "Tamaño inválido." };

  const pet = await db.pet.findFirst({
    where: { id: petId, userId },
    select: { id: true },
  });

  if (!pet) return { ok: false, error: "Mascota no encontrada." };

  await db.pet.update({
    where: { id: petId },
    data: { size },
  });

  return { ok: true };
}
