import { auth } from "@/auth";
import { getBookingUserId } from "@/lib/booking/session";

/** Usuario autenticado (NextAuth) o sesión de reserva invitado. */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  if (session?.user?.id) return session.user.id;
  return getBookingUserId();
}

export async function requireAuthenticatedUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}
