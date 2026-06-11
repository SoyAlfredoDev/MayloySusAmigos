export const groomingBookingConfig = {
  badge: "Peluquería canina",
  title: "Reservar Peluquería",
  description:
    "Indica el tamaño de tu mascota, el tipo de servicio y el horario disponible.",
  steps: [
    "Seleccionar mascota y tamaño (Toy, Pequeño, Mediano, Grande)",
    "Elegir servicio (Baño, Corte, Baño + Corte)",
    "Elegir peluquero y horario",
    "Confirmar reserva",
  ],
  stepAccent: "clinical" as const,
} as const;
