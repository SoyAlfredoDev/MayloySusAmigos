import { db } from "@/lib/db";

export type AdminClientRow = {
  id: string;
  name: string;
  lastName: string | null;
  email: string;
  phone: string | null;
  isActive: boolean;
  createdAt: Date;
  petsCount: number;
  ordersCount: number;
};

export async function getAdminClients(): Promise<AdminClientRow[]> {
  const rows = await db.user.findMany({
    where: { role: "CLIENT" },
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      lastName: true,
      email: true,
      phone: true,
      isActive: true,
      createdAt: true,
      _count: {
        select: {
          petMemberships: true,
          orders: true,
        },
      },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    lastName: row.lastName,
    email: row.email,
    phone: row.phone,
    isActive: row.isActive,
    createdAt: row.createdAt,
    petsCount: row._count.petMemberships,
    ordersCount: row._count.orders,
  }));
}
