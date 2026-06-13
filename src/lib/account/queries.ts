import { db } from "@/lib/db";

export type UserProfile = {
  id: string;
  name: string;
  lastName: string | null;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  marketingConsent: boolean;
  privacyConsentAt: Date | null;
  createdAt: Date;
  petsCount: number;
  appointmentsCount: number;
  ordersCount: number;
};

export async function getUserProfile(
  userId: string,
): Promise<UserProfile | null> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId, isActive: true },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        phone: true,
        avatarUrl: true,
        marketingConsent: true,
        privacyConsentAt: true,
        createdAt: true,
        _count: {
          select: {
            petMemberships: { where: { pet: { isActive: true } } },
            appointments: true,
            orders: true,
          },
        },
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      marketingConsent: user.marketingConsent,
      privacyConsentAt: user.privacyConsentAt,
      createdAt: user.createdAt,
      petsCount: user._count.petMemberships,
      appointmentsCount: user._count.appointments,
      ordersCount: user._count.orders,
    };
  } catch {
    return null;
  }
}
