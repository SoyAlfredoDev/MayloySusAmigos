"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { fadeUp } from "@/lib/motion/variants";

export interface ServiceModuleCardProps {
  title: string;
  description: string;
  href: string;
  index?: number;
  accent?: "milo" | "clinical";
}

const accentBorder = {
  milo: "group-hover:border-milo-400 group-hover:shadow-card-hover",
  clinical: "group-hover:border-clinical-300 group-hover:shadow-card-hover",
};

export function ServiceModuleCard({
  title,
  description,
  href,
  index = 0,
  accent = "milo",
}: ServiceModuleCardProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={reduce ? undefined : { y: -6, transition: { duration: 0.25 } }}
    >
      <Link href={href}>
        <Card
          hover
          className={`group h-full transition-all duration-300 ${accentBorder[accent]}`}
        >
          <motion.div
            className="mb-3 h-1 w-12 rounded-pill bg-milo-400"
            initial={{ width: 48 }}
            whileHover={reduce ? undefined : { width: 64 }}
            transition={{ duration: 0.3 }}
          />
          <h2 className="text-xl font-bold text-milo-700 transition-colors group-hover:text-milo-600">
            {title}
          </h2>
          <p className="mt-2 text-ink-muted">{description}</p>
        </Card>
      </Link>
    </motion.div>
  );
}
