"use server";

import { revalidatePath } from "next/cache";
import type { PetSize, PetSpecies } from "@prisma/client";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { createPetForUser, linkUserToPet } from "@/lib/auth/pets";
import { db } from "@/lib/db";
import type { AuthActionResult } from "@/actions/auth/types";

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

export type PetRow = {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string | null;
  size: PetSize | null;
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
    role: row.role,
    isPrimary: row.isPrimary,
    coOwners: row.pet._count.memberships,
  }));
}

export async function createUserPet(
  _prev: AuthActionResult<{ petId: string }> | null,
  formData: FormData,
): Promise<AuthActionResult<{ petId: string }>> {
  const userId = await requireAuthenticatedUserId();
  if (!userId) {
    return { ok: false, error: "Inicia sesión para registrar mascotas." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const species = String(formData.get("species") ?? "") as PetSpecies;
  const breed = String(formData.get("breed") ?? "").trim() || null;
  const sizeRaw = String(formData.get("size") ?? "").trim();
  const size =
    sizeRaw && sizeValues.has(sizeRaw as PetSize)
      ? (sizeRaw as PetSize)
      : null;

  if (!name) return { ok: false, error: "El nombre es obligatorio." };
  if (!speciesValues.has(species)) {
    return { ok: false, error: "Selecciona una especie válida." };
  }

  const pet = await createPetForUser({
    userId,
    name,
    species,
    breed,
    size,
  });

  revalidatePath("/cuenta/mascotas");
  revalidatePath("/veterinaria");
  revalidatePath("/peluqueria");

  return { ok: true, data: { petId: pet.id } };
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
