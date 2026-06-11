"use client";

import { motion, useReducedMotion } from "framer-motion";
import { springHover } from "@/lib/motion/variants";

const serviceIcons = [
  { label: "Veterinaria", color: "bg-milo-500" },
  { label: "Tienda", color: "bg-milo-400" },
  { label: "Peluquería", color: "bg-clinical-500" },
  { label: "Cuidado", color: "bg-milo-600" },
];

export function HeroVisual() {
  const reduce = useReducedMotion();

  return (
    <div className="relative flex aspect-square items-center justify-center">
      <motion.div
        className="absolute inset-0 rounded-milo bg-gradient-to-br from-milo-100 via-milo-50 to-surface"
        animate={
          reduce
            ? undefined
            : { scale: [1, 1.02, 1], opacity: [0.9, 1, 0.9] }
        }
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-milo-200/60 blur-2xl"
        animate={reduce ? undefined : { scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-clinical-200/40 blur-2xl"
        animate={reduce ? undefined : { scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <motion.div
        className="relative z-10 flex h-full w-full flex-col items-center justify-center rounded-milo border-2 border-ink/10 bg-surface/80 p-8 shadow-card backdrop-blur-sm"
        initial={reduce ? false : { opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        whileHover={reduce ? undefined : { scale: 1.02, transition: springHover }}
      >
        <motion.svg
          viewBox="0 0 80 80"
          className="mb-4 h-20 w-20 text-milo-500"
          animate={reduce ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        >
          <ellipse cx="40" cy="52" rx="16" ry="12" fill="currentColor" />
          <circle cx="24" cy="32" r="7" fill="currentColor" />
          <circle cx="40" cy="26" r="7" fill="currentColor" />
          <circle cx="56" cy="32" r="7" fill="currentColor" />
          <circle cx="30" cy="18" r="5" fill="currentColor" />
          <circle cx="50" cy="18" r="5" fill="currentColor" />
        </motion.svg>

        <p className="text-center text-lg font-bold text-milo-700">
          Cuidamos a tu mejor amigo
        </p>
        <p className="mt-2 text-center text-sm text-ink-muted">
          Veterinaria · Tienda · Peluquería
        </p>

        <div className="mt-6 flex gap-2">
          {serviceIcons.map((item, i) => (
            <motion.div
              key={item.label}
              className={`flex h-10 w-10 items-center justify-center rounded-full ${item.color} text-xs font-bold text-white`}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={reduce ? undefined : { scale: 1.15, y: -2 }}
              title={item.label}
            >
              {item.label[0]}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
