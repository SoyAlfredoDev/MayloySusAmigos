import { db } from "@/lib/db";

export type AdminVetProfessional = {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  isActive: boolean;
  specialtyNames: string[];
  scheduleCount: number;
};

export type AdminVetService = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  durationMinutes: number;
  price: number;
  isActive: boolean;
  specialtyName: string | null;
};

export type AdminVetScheduleRow = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotMinutes: number;
};

export async function getAdminVetProfessionals(): Promise<AdminVetProfessional[]> {
  const rows = await db.professional.findMany({
    where: { module: "VETERINARY" },
    orderBy: { name: "asc" },
    include: {
      specialties: {
        include: { specialty: { select: { name: true } } },
      },
      _count: { select: { schedules: true } },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    bio: row.bio,
    isActive: row.isActive,
    specialtyNames: row.specialties.map((item) => item.specialty.name),
    scheduleCount: row._count.schedules,
  }));
}

export async function getAdminVetServices(): Promise<AdminVetService[]> {
  const rows = await db.service.findMany({
    where: { module: "VETERINARY" },
    orderBy: { name: "asc" },
    include: {
      specialty: { select: { name: true } },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    durationMinutes: row.durationMinutes,
    price: row.price,
    isActive: row.isActive,
    specialtyName: row.specialty?.name ?? null,
  }));
}

export async function getAdminProfessionalSchedules(
  professionalId: string,
): Promise<AdminVetScheduleRow[]> {
  return db.schedule.findMany({
    where: { professionalId },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    select: {
      id: true,
      dayOfWeek: true,
      startTime: true,
      endTime: true,
      slotMinutes: true,
    },
  });
}
