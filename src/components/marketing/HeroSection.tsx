"use client";

import { motion, useReducedMotion } from "framer-motion";
import { HeroVisual } from "@/components/marketing/HeroVisual";
import { Badge } from "@/components/ui/Badge";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { fadeUp, staggerContainer } from "@/lib/motion/variants";

export function HeroSection() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="relative grid items-center gap-12 md:grid-cols-2"
      initial={reduce ? false : "hidden"}
      animate="visible"
      variants={staggerContainer}
    >
      <motion.div variants={fadeUp} transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>
        <motion.div
          initial={reduce ? false : { opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge>Cuidado integral para tu mascota</Badge>
        </motion.div>

        <motion.h1
          className="mt-4 text-4xl font-extrabold leading-tight text-ink md:text-5xl"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Bienvenido a{" "}
          <motion.span
            className="inline-block text-milo-600"
            animate={reduce ? undefined : { y: [0, -3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            {siteConfig.name}
          </motion.span>
        </motion.h1>

        <motion.p
          className="mt-6 max-w-[65ch] text-lg leading-relaxed text-ink-muted"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.18 }}
        >
          Clínica veterinaria, pet shop y peluquería canina en un solo lugar.
          Agenda citas, compra productos y lleva el historial de tus mascotas
          siempre contigo.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap gap-4"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.26 }}
        >
          <motion.div whileHover={reduce ? undefined : { scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button variant="cta" href="/veterinaria">
              Agendar Cita Veterinaria
            </Button>
          </motion.div>
          <motion.div whileHover={reduce ? undefined : { scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button variant="primary" href="/tienda">
              Ver Tienda
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <HeroVisual />
      </motion.div>
    </motion.div>
  );
}
