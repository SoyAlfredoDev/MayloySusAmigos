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
