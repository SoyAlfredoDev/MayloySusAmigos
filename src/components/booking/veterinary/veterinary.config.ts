export const veterinaryBookingConfig = {
  badge: "Módulo de agendamiento",
  title: "Cita Veterinaria",
  description:
    "Selecciona profesional, especialidad, fecha y hora. Los horarios ocupados se bloquean automáticamente.",
  steps: [
    "Seleccionar mascota registrada",
    "Elegir especialidad y profesional",
    "Elegir fecha y horario disponible",
    "Confirmar cita",
  ],
  stepAccent: "milo" as const,
} as const;
