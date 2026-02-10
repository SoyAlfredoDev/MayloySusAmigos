"use client";

import { Section } from "@/components/ui/Section";
import { Check } from "lucide-react";

export function Pets() {
  return (
    <Section id="mascotas" className="bg-muted/30">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Amor para <span className="text-primary">Perros</span> y <span className="text-secondary">Gatos</span>
            </h2>
            <p className="text-lg text-muted-foreground">Especialistas en cada especie.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Dogs Card */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-primary/20 hover:border-primary transition-colors">
                <div className="h-48 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                   <span className="text-4xl">🐶</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-primary">Mundo Canino</h3>
                <ul className="space-y-3">
                    {["Baños medicados", "Corte de raza", "Paseos y Socialización", "Vacunas anuales"].map(item => (
                        <li key={item} className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-primary" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Cats Card */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-primary/20 hover:border-primary transition-colors">
                <div className="h-48 rounded-xl bg-accent flex items-center justify-center mb-6">
                   <span className="text-4xl">🐱</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-accent-foreground">Mundo Felino</h3>
                <ul className="space-y-3">
                    {["Manejo Cat-Friendly", "Sala de espera exclusiva", "Esterilización segura", "Control de parásitos"].map(item => (
                        <li key={item} className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-primary" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </Section>
  );
}
