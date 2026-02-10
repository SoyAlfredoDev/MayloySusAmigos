"use client";

import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Scissors, Stethoscope, Heart, Bath } from "lucide-react";

export function Services() {
  const services = [
    {
      icon: <Stethoscope className="w-10 h-10 text-primary" />,
      title: "Veterinaria General",
      description: "Consultas, vacunación, desparasitación y control de salud para mantener a tu mascota sana y feliz.",
    },
    {
      icon: <Scissors className="w-10 h-10 text-primary" />,
      title: "Peluquería Canina",
      description: "Baños, cortes de raza, limpieza de oídos y corte de uñas con productos de alta calidad.",
    },
    {
      icon: <Bath className="w-10 h-10 text-primary" />,
      title: "Spa & Relax",
      description: "Tratamientos relajantes y dermatológicos para consentir a los más exigentes.",
    },
    {
      icon: <Heart className="w-10 h-10 text-primary" />,
      title: "Cirugías Menores",
      description: "Procedimientos quirúrgicos seguros y esterilizaciones con los mejores cuidados postoperatorios.",
    },
  ];

  return (
    <Section id="servicios" className="bg-background">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
          Nuestros <span className="text-primary">Servicios</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Ofrecemos un cuidado integral para asegurar que tu compañero de vida esté siempre en las mejores manos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, index) => (
          <Card key={index} className="flex flex-col items-center text-center space-y-4 hover:border-primary/50 transition-colors">
            <div className="p-4 bg-muted rounded-full">
              {service.icon}
            </div>
            <h3 className="text-xl font-bold">{service.title}</h3>
            <p className="text-muted-foreground">{service.description}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
