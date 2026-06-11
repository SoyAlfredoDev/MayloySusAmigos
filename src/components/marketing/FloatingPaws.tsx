"use client";

import { motion, useReducedMotion } from "framer-motion";

const paws = [
  { top: "12%", left: "8%", size: 28, delay: 0, duration: 6 },
  { top: "22%", right: "12%", size: 22, delay: 1.2, duration: 7 },
  { top: "68%", left: "6%", size: 20, delay: 0.6, duration: 5.5 },
  { top: "78%", right: "8%", size: 26, delay: 2, duration: 6.5 },
  { top: "45%", left: "18%", size: 16, delay: 1.8, duration: 8 },
];

function PawIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <ellipse cx="12" cy="16" rx="5" ry="4" />
      <circle cx="7" cy="10" r="2.2" />
      <circle cx="12" cy="8" r="2.2" />
      <circle cx="17" cy="10" r="2.2" />
      <circle cx="9" cy="6" r="1.6" />
      <circle cx="15" cy="6" r="1.6" />
    </svg>
  );
}

export function FloatingPaws() {
  const reduce = useReducedMotion();

  if (reduce) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {paws.map((paw, i) => (
        <motion.div
          key={i}
          className="absolute text-milo-300/30"
          style={{
            top: paw.top,
            left: paw.left,
            right: paw.right,
          }}
          animate={{
            y: [0, -14, 0],
            rotate: [0, 8, -4, 0],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{
            duration: paw.duration,
            delay: paw.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <PawIcon size={paw.size} />
        </motion.div>
      ))}
    </div>
  );
}
