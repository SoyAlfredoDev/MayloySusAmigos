"use server";

import { revalidatePath } from "next/cache";
import type { PetSex, PetSize, PetSpecies } from "@prisma/client";
import type { ActionResult } from "@/actions/shop/types";
import { parseCloudinaryUrls } from "@/lib/cloudinary/urls";
import { createPetRecord } from "@/lib/pets/create";
import { db } from "@/lib/db";

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

const sexValues = new Set<PetSex>(["MALE", "FEMALE", "UNKNOWN"]);

function revalidatePetPaths() {
  revalidatePath("/admin/mascotas");
  revalidatePath("/cuenta/mascotas");
  revalidatePath("/veterinaria");
  revalidatePath("/peluqueria");
}

export async function createAdminPet(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  const species = String(formData.get("species") ?? "") as PetSpecies;
  const breed = String(formData.get("breed") ?? "").trim() || null;
  const color = String(formData.get("color") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const sizeRaw = String(formData.get("size") ?? "").trim();
  const sexRaw = String(formData.get("sex") ?? "UNKNOWN").trim();
  const ownerUserId = String(formData.get("ownerUserId") ?? "").trim() || null;
  const weightRaw = String(formData.get("weightKg") ?? "").trim();
  const weightKg = weightRaw ? Number.parseFloat(weightRaw) : null;
  const photoUrls = parseCloudinaryUrls(formData.get("photoUrls"));

  if (!name) return { ok: false, error: "El nombre es obligatorio." };
  if (!speciesValues.has(species)) {
    return { ok: false, error: "Selecciona una especie válida." };
  }

  const size =
    sizeRaw && sizeValues.has(sizeRaw as PetSize)
      ? (sizeRaw as PetSize)
      : null;
  const sex = sexValues.has(sexRaw as PetSex)
    ? (sexRaw as PetSex)
    : "UNKNOWN";

  if (ownerUserId) {
    const owner = await db.user.findFirst({
      where: { id: ownerUserId, isActive: true, role: "CLIENT" },
      select: { id: true },
    });
    if (!owner) {
      return { ok: false, error: "Tutor seleccionado no válido." };
    }
  }

  await createPetRecord({
    name,
    species,
    breed,
    size,
    sex,
    color,
    weightKg: weightKg && !Number.isNaN(weightKg) ? weightKg : null,
    notes,
    photoUrls,
    ownerUserId,
  });

  revalidatePetPaths();
  return { ok: true, message: "Mascota registrada correctamente." };
}
