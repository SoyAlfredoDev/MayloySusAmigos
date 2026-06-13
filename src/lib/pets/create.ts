import { db } from "@/lib/db";
import type { PetSize, PetSex, PetSpecies } from "@prisma/client";

export type CreatePetInput = {
  name: string;
  species: PetSpecies;
  breed?: string | null;
  size?: PetSize | null;
  sex?: PetSex;
  color?: string | null;
  weightKg?: number | null;
  notes?: string | null;
  photoUrls?: string[];
  ownerUserId?: string | null;
};

export async function createPetRecord(input: CreatePetInput) {
  return db.$transaction(async (tx) => {
    const pet = await tx.pet.create({
      data: {
        name: input.name,
        species: input.species,
        breed: input.breed ?? null,
        size: input.size ?? null,
        sex: input.sex ?? "UNKNOWN",
        color: input.color ?? null,
        weightKg: input.weightKg ?? null,
        notes: input.notes ?? null,
        photoUrls: input.photoUrls ?? [],
      },
    });

    if (input.ownerUserId) {
      await tx.petMembership.updateMany({
        where: { petId: pet.id, isPrimary: true },
        data: { isPrimary: false },
      });

      await tx.petMembership.upsert({
        where: {
          userId_petId: {
            userId: input.ownerUserId,
            petId: pet.id,
          },
        },
        update: { role: "OWNER", isPrimary: true },
        create: {
          userId: input.ownerUserId,
          petId: pet.id,
          role: "OWNER",
          isPrimary: true,
        },
      });
    }

    return pet;
  });
}
