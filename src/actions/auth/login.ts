"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import type { AuthActionResult } from "@/actions/auth/types";

export async function loginUser(
  _prev: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const callbackUrl = String(formData.get("callbackUrl") ?? "/cuenta/perfil");

  if (!email || !password) {
    return { ok: false, error: "Ingresa correo y contraseña." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, error: "Correo o contraseña incorrectos." };
    }
    throw error;
  }

  revalidatePath("/cuenta/perfil");
  revalidatePath("/cuenta/mascotas");
  revalidatePath("/cuenta/pedidos");
  revalidatePath("/tienda/checkout");
  revalidatePath("/veterinaria");
  revalidatePath("/peluqueria");
  redirect(callbackUrl);
}

export async function logoutUser() {
  await signOut({ redirectTo: "/" });
}
