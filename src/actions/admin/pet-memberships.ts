"use server";

import { revalidatePath } from "next/cache";
import type { PetMembershipRole } from "@prisma/client";
import type { ActionResult } from "@/actions/shop/types";
import { linkUserToPet } from "@/lib/auth/pets";
import { db } from "@/lib/db";

function revalidatePetAdmin() {
  revalidatePath("/admin/mascotas");
  revalidatePath("/cuenta/mascotas");
  revalidatePath("/veterinaria");
  revalidatePath("/peluqueria");
}

const roleValues = new Set<PetMembershipRole>(["OWNER", "CAREGIVER"]);

export async function linkPetMembership(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const userId = String(formData.get("userId") ?? "").trim();
  const petId = String(formData.get("petId") ?? "").trim();
  const roleRaw = String(formData.get("role") ?? "OWNER").trim();
  const role = roleValues.has(roleRaw as PetMembershipRole)
    ? (roleRaw as PetMembershipRole)
    : "OWNER";
  const isPrimary = formData.get("isPrimary") === "on";

  if (!userId || !petId) {
    return { ok: false, error: "Selecciona un usuario y una mascota." };
  }

  const [user, pet, existing] = await Promise.all([
    db.user.findFirst({
      where: { id: userId, isActive: true, role: "CLIENT" },
      select: { id: true },
    }),
    db.pet.findFirst({
      where: { id: petId, isActive: true },
      select: { id: true },
    }),
    db.petMembership.findUnique({
      where: { userId_petId: { userId, petId } },
      select: { id: true },
    }),
  ]);

  if (!user) return { ok: false, error: "Usuario no encontrado." };
  if (!pet) return { ok: false, error: "Mascota no encontrada." };
  if (existing) {
    return { ok: false, error: "Esta asociación ya existe." };
  }

  if (isPrimary) {
    await db.petMembership.updateMany({
      where: { petId, isPrimary: true },
      data: { isPrimary: false },
    });
  }

  await linkUserToPet({ userId, petId, role, isPrimary });

  revalidatePetAdmin();
  return { ok: true, message: "Mascota vinculada al usuario." };
}

export async function unlinkPetMembership(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const membershipId = String(formData.get("membershipId") ?? "").trim();
  if (!membershipId) {
    return { ok: false, error: "Asociación no válida." };
  }

  const membership = await db.petMembership.findUnique({
    where: { id: membershipId },
    select: { id: true, petId: true },
  });

  if (!membership) {
    return { ok: false, error: "Asociación no encontrada." };
  }

  await db.petMembership.delete({ where: { id: membershipId } });

  revalidatePetAdmin();
  return { ok: true, message: "Asociación desvinculada." };
}
