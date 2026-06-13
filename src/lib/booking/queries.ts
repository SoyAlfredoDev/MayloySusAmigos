import type { ServiceModule } from "@prisma/client";
import { db } from "@/lib/db";
import { computeAvailableSlots } from "@/lib/booking/availability";
import { getZonedParts, zonedDateTimeToUtc } from "@/lib/booking/timezone";
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
  return db.specialty.findMany({
    where: { module },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
    },
  });
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
  return db.pet.findMany({
    where: { userId, isActive: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      species: true,
      breed: true,
      size: true,
    },
  });
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

  const [schedule, appointments, blockedSlots] = await Promise.all([
    db.schedule.findFirst({
      where: {
        professionalId: input.professionalId,
        dayOfWeek,
      },
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
    schedule,
    appointments,
    blockedSlots,
  });
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
