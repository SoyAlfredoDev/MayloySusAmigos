import type {
  AppointmentStatus,
  PetSize,
  PetSpecies,
  ServiceModule,
} from "@prisma/client";

export type BookingModule = ServiceModule;

export interface BookingOwner {
  email: string;
  name: string;
  phone: string;
}

export interface BookingPet {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string | null;
  size: PetSize | null;
}

export interface BookingSpecialty {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface BookingService {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  durationMinutes: number;
  price: number;
  petSize: PetSize | null;
  specialtyId: string | null;
}

export interface BookingProfessional {
  id: string;
  name: string;
  bio: string | null;
  photoUrl: string | null;
  specialtyIds: string[];
}

export interface AvailableSlot {
  startAt: string;
  label: string;
}

export interface BookingDraft {
  module: BookingModule;
  owner: BookingOwner;
  petId: string | null;
  specialtyId: string | null;
  serviceId: string | null;
  professionalId: string | null;
  scheduledAt: string | null;
  notes: string;
}

export interface AppointmentSummary {
  id: string;
  module: ServiceModule;
  status: AppointmentStatus;
  scheduledAt: string;
  durationMinutes: number;
  notes: string | null;
  pet: { id: string; name: string; species: PetSpecies };
  service: { id: string; name: string; price: number };
  professional: { id: string; name: string };
}
