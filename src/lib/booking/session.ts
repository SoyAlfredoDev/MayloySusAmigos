import { cookies } from "next/headers";

export const BOOKING_USER_COOKIE = "mailo_booking_user_id";

export async function getBookingUserId(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(BOOKING_USER_COOKIE)?.value ?? null;
}

export async function setBookingUserId(userId: string): Promise<void> {
  const jar = await cookies();
  jar.set(BOOKING_USER_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export async function clearBookingUserId(): Promise<void> {
  const jar = await cookies();
  jar.delete(BOOKING_USER_COOKIE);
}
