import { db } from "@/lib/db";

export type AdminUserOption = {
  id: string;
  name: string;
  lastName: string | null;
  email: string;
};

export type AdminPetOption = {
  id: string;
  name: string;
  species: import("@prisma/client").PetSpecies;
  breed: string | null;
};

export type AdminPetMembershipRow = {
  id: string;
  userId: string;
  petId: string;
  role: import("@prisma/client").PetMembershipRole;
  isPrimary: boolean;
  createdAt: Date;
  user: {
    name: string;
    lastName: string | null;
    email: string;
  };
  pet: {
    name: string;
    species: import("@prisma/client").PetSpecies;
    breed: string | null;
  };
};

export async function getAdminUserOptions(): Promise<AdminUserOption[]> {
  const rows = await db.user.findMany({
    where: { isActive: true, role: "CLIENT" },
    orderBy: [{ name: "asc" }, { lastName: "asc" }],
    select: {
      id: true,
      name: true,
      lastName: true,
      email: true,
    },
  });

  return rows;
}

export async function getAdminPetOptions(): Promise<AdminPetOption[]> {
  const rows = await db.pet.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      species: true,
      breed: true,
    },
  });

  return rows;
}

export async function getAdminPetMemberships(): Promise<AdminPetMembershipRow[]> {
  const rows = await db.petMembership.findMany({
    where: { pet: { isActive: true }, user: { isActive: true } },
    orderBy: [{ createdAt: "desc" }],
    include: {
      user: {
        select: { name: true, lastName: true, email: true },
      },
      pet: {
        select: { name: true, species: true, breed: true },
      },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    userId: row.userId,
    petId: row.petId,
    role: row.role,
    isPrimary: row.isPrimary,
    createdAt: row.createdAt,
    user: row.user,
    pet: row.pet,
  }));
}
