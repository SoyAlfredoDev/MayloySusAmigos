import type { ServiceModule } from "@prisma/client";
import { db } from "@/lib/db";
import { computeAvailableSlots } from "@/lib/booking/availability";
import { formatDateYmd, getZonedParts, zonedDateTimeToUtc } from "@/lib/booking/timezone";
import type {
  AppointmentSummary,
  BookingPet,
  BookingProfessional,
  BookingService,
  BookingSpecialty,
} from "@/types/booking";

export async function getSpecialties(
  module: ServiceModule,
): Promise<BookingSpecialty[]> {
  try {
    return await db.specialty.findMany({
      where: { module },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
      },
    });
  } catch {
    return [];
  }
}

export async function getServices(
  module: ServiceModule,
  filters?: { specialtyId?: string; petSize?: string },
): Promise<BookingService[]> {
  return db.service.findMany({
    where: {
      module,
      isActive: true,
      ...(filters?.specialtyId ? { specialtyId: filters.specialtyId } : {}),
      ...(filters?.petSize
        ? { OR: [{ petSize: filters.petSize as never }, { petSize: null }] }
        : {}),
    },
    orderBy: [{ price: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      durationMinutes: true,
      price: true,
      petSize: true,
      specialtyId: true,
    },
  });
}

export async function getProfessionals(
  module: ServiceModule,
  specialtyId?: string,
): Promise<BookingProfessional[]> {
  const rows = await db.professional.findMany({
    where: {
      module,
      isActive: true,
      ...(specialtyId
        ? { specialties: { some: { specialtyId } } }
        : {}),
    },
    orderBy: { name: "asc" },
    include: {
      specialties: { select: { specialtyId: true } },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    bio: row.bio,
    photoUrl: row.photoUrl,
    specialtyIds: row.specialties.map((item) => item.specialtyId),
  }));
}

export async function getUserPets(userId: string): Promise<BookingPet[]> {
  const rows = await db.petMembership.findMany({
    where: { userId, pet: { isActive: true } },
    include: { pet: true },
    orderBy: [{ isPrimary: "desc" }, { pet: { name: "asc" } }],
  });

  return rows.map((row) => ({
    id: row.pet.id,
    name: row.pet.name,
    species: row.pet.species,
    breed: row.pet.breed,
    size: row.pet.size,
  }));
}

export async function getAvailableSlotsForBooking(input: {
  professionalId: string;
  serviceId: string;
  dateYmd: string;
}) {
  const service = await db.service.findUnique({
    where: { id: input.serviceId },
    select: { durationMinutes: true, isActive: true },
  });

  if (!service?.isActive) return [];

  const dayAnchor = zonedDateTimeToUtc(input.dateYmd, "12:00");
  const { dayOfWeek } = getZonedParts(dayAnchor);
  const dayStart = zonedDateTimeToUtc(input.dateYmd, "00:00");
  const dayEnd = zonedDateTimeToUtc(input.dateYmd, "23:59");

  const [schedules, appointments, blockedSlots] = await Promise.all([
    db.schedule.findMany({
      where: {
        professionalId: input.professionalId,
        dayOfWeek,
      },
      orderBy: { startTime: "asc" },
    }),
    db.appointment.findMany({
      where: {
        professionalId: input.professionalId,
        scheduledAt: { gte: dayStart, lte: dayEnd },
      },
      select: {
        scheduledAt: true,
        durationMinutes: true,
        status: true,
      },
    }),
    db.blockedSlot.findMany({
      where: {
        professionalId: input.professionalId,
        startAt: { lt: dayEnd },
        endAt: { gt: dayStart },
      },
      select: { startAt: true, endAt: true },
    }),
  ]);

  return computeAvailableSlots({
    dateYmd: input.dateYmd,
    durationMinutes: service.durationMinutes,
    schedules,
    appointments,
    blockedSlots,
  });
}

export type ProfessionalScheduleDay = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotMinutes: number;
};

export async function getProfessionalSchedules(
  professionalId: string,
): Promise<ProfessionalScheduleDay[]> {
  const rows = await db.schedule.findMany({
    where: { professionalId },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    select: {
      dayOfWeek: true,
      startTime: true,
      endTime: true,
      slotMinutes: true,
    },
  });

  return rows;
}

export async function isSlotAvailableForBooking(input: {
  professionalId: string;
  serviceId: string;
  scheduledAt: string;
}): Promise<boolean> {
  const scheduledDate = new Date(input.scheduledAt);
  if (Number.isNaN(scheduledDate.getTime())) return false;

  const dateYmd = formatDateYmd(scheduledDate);
  const slots = await getAvailableSlotsForBooking({
    professionalId: input.professionalId,
    serviceId: input.serviceId,
    dateYmd,
  });

  return slots.some((slot) => slot.startAt === scheduledDate.toISOString());
}

export async function getUserAppointments(
  userId: string,
): Promise<AppointmentSummary[]> {
  const rows = await db.appointment.findMany({
    where: { userId },
    orderBy: { scheduledAt: "desc" },
    include: {
      pet: { select: { id: true, name: true, species: true } },
      service: { select: { id: true, name: true, price: true } },
      professional: { select: { id: true, name: true } },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    module: row.module,
    status: row.status,
    scheduledAt: row.scheduledAt.toISOString(),
    durationMinutes: row.durationMinutes,
    notes: row.notes,
    pet: row.pet,
    service: row.service,
    professional: row.professional,
  }));
}

export async function getAppointmentById(
  id: string,
  userId: string,
): Promise<AppointmentSummary | null> {
  const row = await db.appointment.findFirst({
    where: { id, userId },
    include: {
      pet: { select: { id: true, name: true, species: true } },
      service: { select: { id: true, name: true, price: true } },
      professional: { select: { id: true, name: true } },
    },
  });

  if (!row) return null;

  return {
    id: row.id,
    module: row.module,
    status: row.status,
    scheduledAt: row.scheduledAt.toISOString(),
    durationMinutes: row.durationMinutes,
    notes: row.notes,
    pet: row.pet,
    service: row.service,
    professional: row.professional,
  };
}
