"use server";

import { revalidatePath } from "next/cache";
import type { PetSize, PetSpecies } from "@prisma/client";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { linkUserToPet } from "@/lib/auth/pets";
import { db } from "@/lib/db";
import type { AuthActionResult } from "@/actions/auth/types";

export type PetRow = {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string | null;
  size: PetSize | null;
  photoUrls: string[];
  role: string;
  isPrimary: boolean;
  coOwners: number;
};

export async function fetchUserPets(): Promise<PetRow[]> {
  const userId = await requireAuthenticatedUserId();
  if (!userId) return [];

  const rows = await db.petMembership.findMany({
    where: { userId, pet: { isActive: true } },
    include: {
      pet: {
        include: {
          _count: { select: { memberships: true } },
        },
      },
    },
    orderBy: [{ isPrimary: "desc" }, { pet: { name: "asc" } }],
  });

  return rows.map((row) => ({
    id: row.pet.id,
    name: row.pet.name,
    species: row.pet.species,
    breed: row.pet.breed,
    size: row.pet.size,
    photoUrls: row.pet.photoUrls,
    role: row.role,
    isPrimary: row.isPrimary,
    coOwners: row.pet._count.memberships,
  }));
}

export async function createUserPet(
  _prev: AuthActionResult<{ petId: string }> | null,
  _formData: FormData,
): Promise<AuthActionResult<{ petId: string }>> {
  return {
    ok: false,
    error:
      "Solo el equipo Mailo puede registrar mascotas. Contacta a la clínica si necesitas agregar una.",
  };
}

/** Vincula un usuario existente como co-tutor de una mascota (por email). */
export async function addPetCoOwner(
  _prev: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> {
  const userId = await requireAuthenticatedUserId();
  if (!userId) return { ok: false, error: "Inicia sesión." };

  const petId = String(formData.get("petId") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!petId || !email) {
    return { ok: false, error: "Datos incompletos." };
  }

  const ownsPet = await db.petMembership.findUnique({
    where: { userId_petId: { userId, petId } },
    select: { role: true },
  });

  if (!ownsPet || ownsPet.role !== "OWNER") {
    return { ok: false, error: "Solo el tutor principal puede invitar." };
  }

  const coUser = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!coUser) {
    return {
      ok: false,
      error: "No hay cuenta con ese correo. Pídele que se registre primero.",
    };
  }

  if (coUser.id === userId) {
    return { ok: false, error: "Ya eres tutor de esta mascota." };
  }

  await linkUserToPet({
    userId: coUser.id,
    petId,
    role: "CAREGIVER",
    isPrimary: false,
  });

  revalidatePath("/cuenta/mascotas");
  return { ok: true, message: "Co-tutor vinculado correctamente." };
}
