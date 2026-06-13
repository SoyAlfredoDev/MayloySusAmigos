import { db } from "@/lib/db";
import type { PetMembershipRole } from "@prisma/client";

export async function userHasPetAccess(
  userId: string,
  petId: string,
): Promise<boolean> {
  const membership = await db.petMembership.findUnique({
    where: { userId_petId: { userId, petId } },
    select: { id: true },
  });
  return Boolean(membership);
}

export async function linkUserToPet(input: {
  userId: string;
  petId: string;
  role?: PetMembershipRole;
  isPrimary?: boolean;
}) {
  return db.petMembership.upsert({
    where: {
      userId_petId: { userId: input.userId, petId: input.petId },
    },
    update: {
      role: input.role,
      isPrimary: input.isPrimary,
    },
    create: {
      userId: input.userId,
      petId: input.petId,
      role: input.role ?? "OWNER",
      isPrimary: input.isPrimary ?? false,
    },
  });
}

export async function createPetForUser(input: {
  userId: string;
  name: string;
  species: import("@prisma/client").PetSpecies;
  breed?: string | null;
  size?: import("@prisma/client").PetSize | null;
}) {
  return db.$transaction(async (tx) => {
    const pet = await tx.pet.create({
      data: {
        createdById: input.userId,
        name: input.name,
        species: input.species,
        breed: input.breed ?? null,
        size: input.size ?? null,
      },
    });

    await tx.petMembership.create({
      data: {
        userId: input.userId,
        petId: pet.id,
        role: "OWNER",
        isPrimary: true,
      },
    });

    return pet;
  });
}
