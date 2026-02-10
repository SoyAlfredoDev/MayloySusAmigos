"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, PawPrint, User, Mail, Phone, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function BookingForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    petName: "",
    petType: "perro",
    petBreed: "",
    petSize: "mediano",
    petAge: "",
    service: "veterinaria",
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
    date: "",
    time: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.petName) newErrors.petName = "El nombre de la mascota es requerido";
    if (!formData.petAge) newErrors.petAge = "La edad es requerida";
    if (!formData.ownerName) newErrors.ownerName = "Tu nombre es requerido";
    if (!formData.ownerPhone) newErrors.ownerPhone = "El teléfono es requerido";
    if (!formData.ownerEmail) newErrors.ownerEmail = "El email es requerido";
    if (!formData.date) newErrors.date = "La fecha es requerida";
    if (!formData.time) newErrors.time = "La hora es requerida";

    // Date validation (must be future)
    if (formData.date && formData.time) {
      const selectedDate = new Date(`${formData.date}T${formData.time}`);
      const now = new Date();
      if (selectedDate <= now) {
        newErrors.date = "La fecha y hora deben ser futuras";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Reserva enviada:", formData);
    setIsSubmitting(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
          <PawPrint className="w-5 h-5" /> Datos de la Mascota
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre de la mascota *</label>
            <input
              type="text"
              name="petName"
              value={formData.petName}
              onChange={handleChange}
              className={`w-full p-2 rounded-lg border bg-background ${errors.petName ? "border-red-500" : "border-border"} focus:ring-2 focus:ring-primary outline-none transition-all`}
              placeholder="Ej. Firulais"
            />
            {errors.petName && <p className="text-xs text-red-500">{errors.petName}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo</label>
            <select
              name="petType"
              value={formData.petType}
              onChange={handleChange}
              className="w-full p-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
            >
              <option value="perro">Perro 🐶</option>
              <option value="gato">Gato 🐱</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Raza (Opcional)</label>
            <input
              type="text"
              name="petBreed"
              value={formData.petBreed}
              onChange={handleChange}
              className="w-full p-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="Ej. Labrador"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Edad</label>
            <input
              type="text"
              name="petAge"
              value={formData.petAge}
              onChange={handleChange}
              className={`w-full p-2 rounded-lg border bg-background ${errors.petAge ? "border-red-500" : "border-border"} focus:ring-2 focus:ring-primary outline-none transition-all`}
              placeholder="Ej. 3 años"
            />
             {errors.petAge && <p className="text-xs text-red-500">{errors.petAge}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tamaño</label>
            <select
              name="petSize"
              value={formData.petSize}
              onChange={handleChange}
              className="w-full p-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
            >
              <option value="pequeño">Pequeño</option>
              <option value="mediano">Mediano</option>
              <option value="grande">Grande</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Servicio</label>
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="w-full p-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
            >
              <option value="veterinaria">Veterinaria 🩺</option>
              <option value="peluqueria">Peluquería ✂️</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
          <User className="w-5 h-5" /> Datos del Dueño
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre completo *</label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              className={`w-full p-2 rounded-lg border bg-background ${errors.ownerName ? "border-red-500" : "border-border"} focus:ring-2 focus:ring-primary outline-none transition-all`}
              placeholder="Tu nombre"
            />
             {errors.ownerName && <p className="text-xs text-red-500">{errors.ownerName}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Teléfono (WhatsApp) *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="tel"
                name="ownerPhone"
                value={formData.ownerPhone}
                onChange={handleChange}
                className={`w-full pl-9 p-2 rounded-lg border bg-background ${errors.ownerPhone ? "border-red-500" : "border-border"} focus:ring-2 focus:ring-primary outline-none transition-all`}
                placeholder="999 999 999"
              />
            </div>
             {errors.ownerPhone && <p className="text-xs text-red-500">{errors.ownerPhone}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Correo electrónico *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                name="ownerEmail"
                value={formData.ownerEmail}
                onChange={handleChange}
                className={`w-full pl-9 p-2 rounded-lg border bg-background ${errors.ownerEmail ? "border-red-500" : "border-border"} focus:ring-2 focus:ring-primary outline-none transition-all`}
                placeholder="correo@ejemplo.com"
              />
            </div>
             {errors.ownerEmail && <p className="text-xs text-red-500">{errors.ownerEmail}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
          <Calendar className="w-5 h-5" /> Agendar Cita
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="space-y-2">
            <label className="text-sm font-medium">Fecha *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full p-2 rounded-lg border bg-background ${errors.date ? "border-red-500" : "border-border"} focus:ring-2 focus:ring-primary outline-none transition-all`}
            />
             {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Hora *</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={`w-full pl-9 p-2 rounded-lg border bg-background ${errors.time ? "border-red-500" : "border-border"} focus:ring-2 focus:ring-primary outline-none transition-all`}
              />
            </div>
             {errors.time && <p className="text-xs text-red-500">{errors.time}</p>}
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Agendando..." : "Confirmar Reserva"}
        </Button>
      </div>
    </form>
  );
}
