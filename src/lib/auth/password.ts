import bcrypt from "bcryptjs";

/** Cost factor 12 — recomendado para producción (OWASP / buenas prácticas). */
const BCRYPT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function validatePasswordStrength(password: string): string | null {
  if (password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return "La contraseña debe incluir letras y números.";
  }
  return null;
}
