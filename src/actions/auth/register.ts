"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  hashPassword,
  validatePasswordStrength,
} from "@/lib/auth/password";
import type { AuthActionResult } from "@/actions/auth/types";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function registerUser(
  _prev: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim() || null;
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const privacyConsent = formData.get("privacyConsent") === "on";
  const marketingConsent = formData.get("marketingConsent") === "on";

  if (!name) return { ok: false, error: "Ingresa tu nombre." };
  if (!email || !isValidEmail(email)) {
    return { ok: false, error: "Ingresa un correo válido." };
  }
  if (!phone) return { ok: false, error: "Ingresa tu teléfono." };
  if (!privacyConsent) {
    return {
      ok: false,
      error:
        "Debes aceptar el tratamiento de datos personales (Ley 19.628 Chile).",
    };
  }

  const passwordError = validatePasswordStrength(password);
  if (passwordError) return { ok: false, error: passwordError };
  if (password !== confirmPassword) {
    return { ok: false, error: "Las contraseñas no coinciden." };
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing?.password) {
    return {
      ok: false,
      error: "Ya existe una cuenta con este correo. Inicia sesión.",
    };
  }

  const passwordHash = await hashPassword(password);

  if (existing) {
    await db.user.update({
      where: { id: existing.id },
      data: {
        name,
        lastName,
        phone,
        password: passwordHash,
        marketingConsent,
        privacyConsentAt: new Date(),
        isActive: true,
      },
    });
  } else {
    await db.user.create({
      data: {
        name,
        lastName,
        email,
        phone,
        password: passwordHash,
        marketingConsent,
        privacyConsentAt: new Date(),
      },
    });
  }

  revalidatePath("/cuenta/perfil");
  return { ok: true, message: "Cuenta creada. Ya puedes iniciar sesión." };
}
