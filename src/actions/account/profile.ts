"use server";

import { revalidatePath } from "next/cache";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { db } from "@/lib/db";
import type { AuthActionResult } from "@/actions/auth/types";

const CLOUDINARY_HOST = "res.cloudinary.com";

function isValidAvatarUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      parsed.hostname === CLOUDINARY_HOST &&
      parsed.pathname.length > 1
    );
  } catch {
    return false;
  }
}

export async function updateUserAvatar(
  _prev: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> {
  const userId = await requireAuthenticatedUserId();
  if (!userId) {
    return { ok: false, error: "Debes iniciar sesión." };
  }

  const raw = String(formData.get("avatarUrl") ?? "").trim();
  const avatarUrl = raw === "" ? null : raw;

  if (avatarUrl && !isValidAvatarUrl(avatarUrl)) {
    return { ok: false, error: "La imagen debe subirse desde Cloudinary." };
  }

  await db.user.update({
    where: { id: userId },
    data: { avatarUrl },
  });

  revalidatePath("/cuenta/perfil");

  return {
    ok: true,
    message: avatarUrl ? "Foto de perfil actualizada." : "Foto de perfil eliminada.",
  };
}
