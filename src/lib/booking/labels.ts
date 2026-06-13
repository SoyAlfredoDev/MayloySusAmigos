import type { AppointmentStatus, PetSize, PetSpecies, ServiceModule } from "@prisma/client";

export const petSpeciesLabels: Record<PetSpecies, string> = {
  DOG: "Perro",
  CAT: "Gato",
  BIRD: "Ave",
  RODENT: "Roedor",
  OTHER: "Otro",
};

export const petSizeLabels: Record<PetSize, string> = {
  TOY: "Toy (hasta 4 kg)",
  SMALL: "Pequeño (4–10 kg)",
  MEDIUM: "Mediano (10–25 kg)",
  LARGE: "Grande (25–40 kg)",
  GIANT: "Gigante (+40 kg)",
};

export const moduleLabels: Record<ServiceModule, string> = {
  VETERINARY: "Veterinaria",
  GROOMING: "Peluquería",
};

export const appointmentStatusLabels: Record<AppointmentStatus, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
  COMPLETED: "Completada",
  NO_SHOW: "No asistió",
};

export const dayOfWeekLabels = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
] as const;

export const dayOfWeekShortLabels = [
  "Dom",
  "Lun",
  "Mar",
  "Mié",
  "Jue",
  "Vie",
  "Sáb",
] as const;

export const petMembershipRoleLabels = {
  OWNER: "Tutor principal",
  CAREGIVER: "Co-tutor",
} as const;
