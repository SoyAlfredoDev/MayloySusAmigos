"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { BookingModal } from "@/components/booking/BookingModal";

export function Hero() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background pt-20">
      {/* Abstract Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[10%] right-[20%] w-[30%] h-[30%] bg-accent rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="space-y-6 text-center md:text-left"
        >
          <div className="inline-block px-4 py-2 bg-accent/20 text-accent-foreground font-semibold rounded-full text-sm">
            🐾 La mejor atención para tu mascota
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-foreground">
             Salud y belleza <br /> 
             <span className="text-primary">con amor.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto md:mx-0">
             En <strong>Milo y sus amigos</strong>, tratamos a tu peludo como parte de nuestra familia. Veterinaria y peluquería profesional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button size="lg" onClick={() => setIsBookingOpen(true)}>Reservar Cita</Button>
            <Button size="lg" variant="outline">Nuestros Servicios</Button>
          </div>
        </motion.div>

        {/* Hero Image / Illustration Placeholder */}
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="relative aspect-square md:aspect-auto md:h-[600px] flex items-center justify-center"
        >
           {/* In a real project, use <Image> here. For now, a styled placeholder */}
           <div className="w-full h-full bg-gradient-to-br from-muted to-border rounded-[3rem] shadow-2xl overflow-hidden relative border-8 border-white">
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 text-2xl font-bold">
                 [Imagen Hero: Mascota Feliz]
              </div>
           </div>
           
           {/* Floating badges */}
           <motion.div 
             animate={{ y: [0, -10, 0] }}
             transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
             className="absolute -bottom-8 -left-4 md:bottom-12 md:-left-8 bg-white p-4 rounded-xl shadow-lg border border-border flex items-center gap-3 z-20"
           >
             <div className="w-10 h-10 bg-accent items-center justify-center flex rounded-full text-2xl">🐶</div>
             <div>
               <p className="font-bold text-sm">Atención Personalizada</p>
               <p className="text-xs text-muted-foreground">Expertos certificados</p>
             </div>
           </motion.div>
        </motion.div>
      </div>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </section>
  );
}

