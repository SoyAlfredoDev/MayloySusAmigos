"use client";

import { Section } from "@/components/ui/Section";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function WhyUs() {
  const reasons = [
    "Equipo profesional y amante de los animales.",
    "Instalaciones modernas y seguras.",
    "Productos hipoalergénicos de primera calidad.",
    "Atención personalizada y libre de estrés.",
    "Horarios flexibles y atención de emergencias.",
  ];

  return (
    <Section id="nosotros" dark className="relative overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
         <div className="order-2 md:order-1 relative h-[400px] bg-white rounded-3xl overflow-hidden shadow-xl border-4 border-primary/20">
             {/* Placeholder for 'About Us' Image */}
             <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xl font-bold">
                 [Imagen Equipo / Local]
             </div>
         </div>

         <div className="order-1 md:order-2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              ¿Por qué elegir <span className="text-primary">Milo?</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Sabemos que tu mascota es familia. Por eso, nos esforzamos en brindar un servicio que combine excelencia médica con un trato humano y cariñoso.
            </p>
            <ul className="space-y-4">
              {reasons.map((reason, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 text-lg"
                >
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                  <span>{reason}</span>
                </motion.li>
              ))}
            </ul>
         </div>
      </div>
    </Section>
  );
}
