"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { PetSize, PetSpecies, ServiceModule } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { BookingProgress } from "@/components/booking/shared/BookingProgress";
import { SelectableCard } from "@/components/booking/shared/SelectableCard";
import {
  createAppointment,
} from "@/actions/booking/appointments";
import { fetchAvailableSlots } from "@/actions/booking/availability";
import {
  createBookingPet,
  fetchBookingPets,
  resolveBookingOwner,
  updatePetSize,
} from "@/actions/booking/pets";
import { petSizeLabels, petSpeciesLabels } from "@/lib/booking/labels";
import { addDaysYmd, formatAppointmentDate, todayYmd } from "@/lib/booking/timezone";
import { formatCLP } from "@/lib/utils";
import type {
  BookingPet,
  BookingProfessional,
  BookingService,
  BookingSpecialty,
} from "@/types/booking";

type WizardConfig = {
  module: ServiceModule;
  steps: readonly string[];
  accent: "milo" | "clinical";
  confirmPath: string;
};

type BookingWizardProps = {
  config: WizardConfig;
  specialties: BookingSpecialty[];
  services: BookingService[];
  professionals: BookingProfessional[];
  initialPets: BookingPet[];
};

const speciesOptions: PetSpecies[] = ["DOG", "CAT", "BIRD", "RODENT", "OTHER"];
const sizeOptions: PetSize[] = ["TOY", "SMALL", "MEDIUM", "LARGE", "GIANT"];

export function BookingWizard({
  config,
  specialties,
  services,
  professionals,
  initialPets,
}: BookingWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [ownerReady, setOwnerReady] = useState(initialPets.length > 0);
  const [pets, setPets] = useState<BookingPet[]>(initialPets);
  const [petId, setPetId] = useState<string | null>(initialPets[0]?.id ?? null);
  const [specialtyId, setSpecialtyId] = useState<string | null>(null);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  const [dateYmd, setDateYmd] = useState(todayYmd());
  const [scheduledAt, setScheduledAt] = useState<string | null>(null);
  const [slots, setSlots] = useState<{ startAt: string; label: string }[]>([]);
  const [notes, setNotes] = useState("");
  const [showNewPet, setShowNewPet] = useState(initialPets.length === 0);

  const selectedPet = pets.find((pet) => pet.id === petId) ?? null;
  const selectedService = services.find((svc) => svc.id === serviceId) ?? null;
  const selectedProfessional =
    professionals.find((pro) => pro.id === professionalId) ?? null;

  const filteredServices =
    config.module === "VETERINARY"
      ? services.filter((svc) => !specialtyId || svc.specialtyId === specialtyId)
      : services.filter(
          (svc) =>
            !selectedPet?.size ||
            !svc.petSize ||
            svc.petSize === selectedPet.size,
        );

  const filteredProfessionals =
    config.module === "VETERINARY" && specialtyId
      ? professionals.filter((pro) => pro.specialtyIds.includes(specialtyId))
      : professionals;

  useEffect(() => {
    if (!professionalId || !serviceId || !dateYmd) {
      setSlots([]);
      return;
    }

    startTransition(async () => {
      const result = await fetchAvailableSlots({
        professionalId,
        serviceId,
        dateYmd,
      });
      if (result.ok && result.data) {
        setSlots(result.data);
        if (
          scheduledAt &&
          !result.data.some((slot) => slot.startAt === scheduledAt)
        ) {
          setScheduledAt(null);
        }
      } else {
        setSlots([]);
        setScheduledAt(null);
      }
    });
  }, [professionalId, serviceId, dateYmd]);

  function goNext() {
    setError(null);
    setStep((current) => Math.min(current + 1, config.steps.length - 1));
  }

  function goBack() {
    setError(null);
    setStep((current) => Math.max(current - 1, 0));
  }

  function handleOwnerSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await resolveBookingOwner(null, formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setOwnerReady(true);
      const nextPets = await fetchBookingPets();
      setPets(nextPets);
      if (nextPets.length > 0) {
        setPetId(nextPets[0].id);
        setShowNewPet(false);
      } else {
        setShowNewPet(true);
      }
    });
  }

  function handlePetSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createBookingPet(null, formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      const nextPets = await fetchBookingPets();
      setPets(nextPets);
      const newPetId = result.data?.petId ?? null;
      setPetId(newPetId);
      setShowNewPet(false);
    });
  }

  function handlePetSizeChange(size: PetSize) {
    if (!petId) return;
    startTransition(async () => {
      const result = await updatePetSize(petId, size);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setPets((current) =>
        current.map((pet) => (pet.id === petId ? { ...pet, size } : pet)),
      );
      setServiceId(null);
    });
  }

  function validateStep(): string | null {
    if (step === 0) {
      if (!ownerReady) return "Ingresa tus datos de contacto.";
      if (!petId) return "Selecciona o registra una mascota.";
      if (config.module === "GROOMING" && !selectedPet?.size) {
        return "Indica el tamaño de tu mascota.";
      }
    }
    if (step === 1) {
      if (config.module === "VETERINARY" && !specialtyId) {
        return "Selecciona una especialidad.";
      }
      if (!serviceId) return "Selecciona un servicio.";
    }
    if (step === 2) {
      if (!professionalId) return "Selecciona un profesional.";
      if (!scheduledAt) return "Selecciona un horario disponible.";
    }
    return null;
  }

  function handleContinue() {
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    goNext();
  }

  function handleConfirm() {
    if (!petId || !serviceId || !professionalId || !scheduledAt) {
      setError("Faltan datos para confirmar la cita.");
      return;
    }

    startTransition(async () => {
      const result = await createAppointment({
        module: config.module,
        petId,
        serviceId,
        professionalId,
        scheduledAt,
        notes,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.push(
        `${config.confirmPath}?id=${result.data?.appointmentId ?? ""}`,
      );
    });
  }

  return (
    <div>
      <BookingProgress
        steps={[...config.steps]}
        currentStep={step}
        accent={config.accent}
      />

      {error && (
        <Alert variant="error" title="Revisa los datos" className="mb-6 mt-0">
          {error}
        </Alert>
      )}

      {step === 0 && (
        <section className="space-y-6">
          {!ownerReady && (
            <form action={handleOwnerSubmit} className="card-milo space-y-4">
              <h2 className="text-lg font-semibold text-ink">Tus datos</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="font-medium">Nombre</span>
                  <input
                    name="name"
                    required
                    className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2"
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium">Teléfono</span>
                  <input
                    name="phone"
                    required
                    className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2"
                  />
                </label>
              </div>
              <label className="block text-sm">
                <span className="font-medium">Correo</span>
                <input
                  name="email"
                  type="email"
                  required
                  className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2"
                />
              </label>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Guardando..." : "Continuar"}
              </Button>
            </form>
          )}

          {ownerReady && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-ink">Tu mascota</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewPet((value) => !value)}
                >
                  {showNewPet ? "Elegir existente" : "Agregar mascota"}
                </Button>
              </div>

              {!showNewPet && pets.length > 0 && (
                <div className="grid gap-3">
                  {pets.map((pet) => (
                    <SelectableCard
                      key={pet.id}
                      title={pet.name}
                      description={`${petSpeciesLabels[pet.species]}${pet.breed ? ` · ${pet.breed}` : ""}`}
                      meta={
                        pet.size ? petSizeLabels[pet.size] : "Sin tamaño"
                      }
                      selected={petId === pet.id}
                      onClick={() => setPetId(pet.id)}
                    />
                  ))}
                </div>
              )}

              {showNewPet && (
                <form action={handlePetSubmit} className="card-milo space-y-4">
                  <label className="block text-sm">
                    <span className="font-medium">Nombre</span>
                    <input
                      name="name"
                      required
                      className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="font-medium">Especie</span>
                    <select
                      name="species"
                      required
                      defaultValue="DOG"
                      className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2"
                    >
                      {speciesOptions.map((species) => (
                        <option key={species} value={species}>
                          {petSpeciesLabels[species]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-sm">
                    <span className="font-medium">Raza (opcional)</span>
                    <input
                      name="breed"
                      className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2"
                    />
                  </label>
                  {config.module === "GROOMING" && (
                    <label className="block text-sm">
                      <span className="font-medium">Tamaño</span>
                      <select
                        name="size"
                        required
                        className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2"
                      >
                        <option value="">Seleccionar...</option>
                        {sizeOptions.map((size) => (
                          <option key={size} value={size}>
                            {petSizeLabels[size]}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Guardando..." : "Guardar mascota"}
                  </Button>
                </form>
              )}

              {config.module === "GROOMING" && selectedPet && !showNewPet && (
                <div className="card-milo space-y-3">
                  <p className="text-sm font-medium text-ink">
                    Tamaño de {selectedPet.name}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {sizeOptions.map((size) => (
                      <SelectableCard
                        key={size}
                        title={petSizeLabels[size]}
                        selected={selectedPet.size === size}
                        onClick={() => handlePetSizeChange(size)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {step === 1 && (
        <section className="space-y-4">
          {config.module === "VETERINARY" && (
            <>
              <h2 className="text-lg font-semibold text-ink">Especialidad</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {specialties.map((specialty) => (
                  <SelectableCard
                    key={specialty.id}
                    title={specialty.name}
                    description={specialty.description}
                    selected={specialtyId === specialty.id}
                    onClick={() => {
                      setSpecialtyId(specialty.id);
                      setServiceId(null);
                    }}
                  />
                ))}
              </div>
            </>
          )}

          <h2 className="text-lg font-semibold text-ink">Servicio</h2>
          <div className="grid gap-3">
            {filteredServices.map((service) => (
              <SelectableCard
                key={service.id}
                title={service.name}
                description={service.description}
                meta={`${formatCLP(service.price)} · ${service.durationMinutes} min`}
                selected={serviceId === service.id}
                onClick={() => setServiceId(service.id)}
              />
            ))}
            {filteredServices.length === 0 && (
              <p className="text-sm text-ink-muted">
                {config.module === "GROOMING"
                  ? "Selecciona el tamaño de tu mascota para ver servicios."
                  : "Selecciona una especialidad para ver servicios."}
              </p>
            )}
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-ink">Profesional</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {filteredProfessionals.map((pro) => (
                <SelectableCard
                  key={pro.id}
                  title={pro.name}
                  description={pro.bio}
                  selected={professionalId === pro.id}
                  onClick={() => {
                    setProfessionalId(pro.id);
                    setScheduledAt(null);
                  }}
                />
              ))}
            </div>
          </div>

          <div className="card-milo space-y-4">
            <h2 className="text-lg font-semibold text-ink">Fecha y horario</h2>
            <label className="block text-sm">
              <span className="font-medium">Fecha</span>
              <input
                type="date"
                value={dateYmd}
                min={todayYmd()}
                max={addDaysYmd(todayYmd(), 60)}
                onChange={(event) => {
                  setDateYmd(event.target.value);
                  setScheduledAt(null);
                }}
                className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2"
              />
            </label>

            {professionalId && serviceId && (
              <div>
                <p className="mb-2 text-sm font-medium text-ink">
                  Horarios disponibles
                </p>
                {isPending && (
                  <p className="text-sm text-ink-muted">Cargando horarios...</p>
                )}
                {!isPending && slots.length === 0 && (
                  <p className="text-sm text-ink-muted">
                    No hay horarios para esta fecha. Prueba otro día.
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot.startAt}
                      type="button"
                      onClick={() => setScheduledAt(slot.startAt)}
                      className={
                        scheduledAt === slot.startAt
                          ? "rounded-pill bg-milo-500 px-4 py-2 text-sm font-semibold text-white"
                          : "rounded-pill border border-surface-border bg-white px-4 py-2 text-sm font-medium text-ink hover:border-milo-300"
                      }
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {step === 3 && selectedPet && selectedService && selectedProfessional && scheduledAt && (
        <section className="card-milo space-y-4">
          <h2 className="text-lg font-semibold text-ink">Resumen</h2>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-ink-muted">Mascota</dt>
              <dd className="font-medium">{selectedPet.name}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Servicio</dt>
              <dd className="font-medium">{selectedService.name}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Profesional</dt>
              <dd className="font-medium">{selectedProfessional.name}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Fecha y hora</dt>
              <dd className="font-medium">
                {formatAppointmentDate(new Date(scheduledAt))}
              </dd>
            </div>
            <div>
              <dt className="text-ink-muted">Duración</dt>
              <dd className="font-medium">
                {selectedService.durationMinutes} minutos
              </dd>
            </div>
            <div>
              <dt className="text-ink-muted">Precio referencial</dt>
              <dd className="font-medium">{formatCLP(selectedService.price)}</dd>
            </div>
          </dl>
          <label className="block text-sm">
            <span className="font-medium">Notas (opcional)</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2"
              placeholder="Síntomas, preferencias de corte, etc."
            />
          </label>
        </section>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        {step > 0 && (
          <Button variant="ghost" onClick={goBack} disabled={isPending}>
            Atrás
          </Button>
        )}
        {step < config.steps.length - 1 && ownerReady && (
          <Button onClick={handleContinue} disabled={isPending}>
            Continuar
          </Button>
        )}
        {step === config.steps.length - 1 && (
          <Button onClick={handleConfirm} disabled={isPending}>
            {isPending ? "Confirmando..." : "Confirmar cita"}
          </Button>
        )}
      </div>
    </div>
  );
}
