"use client";

import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`bg-card text-card-foreground p-6 rounded-2xl shadow-lg border border-border/50 ${className || ""}`}
    >
      {children}
    </motion.div>
  );
}
