"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { AuthNav } from "@/components/auth";
import { CartNavLink } from "@/components/shop/CartNavLink";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
  cartItemCount?: number;
}

export function Header({ className, cartItemCount = 0 }: HeaderProps) {
  const reduce = useReducedMotion();

  return (
    <motion.header
      initial={reduce ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "sticky top-0 z-50 border-b-2 border-ink/10 bg-surface/95 backdrop-blur-sm",
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label={siteConfig.name}
        >
          <motion.div
            whileHover={reduce ? undefined : { scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            {/* img nativo: evita conflictos de tamaño con next/image en logos grandes */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={siteConfig.logo.src}
              alt={siteConfig.logo.alt}
              width={111}
              height={150}
              className="block h-16 w-auto object-contain md:h-[4.5rem]"
              decoding="async"
            />
          </motion.div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {siteConfig.nav.main.map((item, i) => (
            <motion.div
              key={item.href}
              initial={reduce ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.35 }}
            >
              <Link
                href={item.href}
                className="relative font-semibold text-ink-muted transition-colors hover:text-milo-600"
              >
                {item.label}
                <motion.span
                  className="absolute -bottom-1 left-0 h-0.5 w-full origin-left rounded-full bg-milo-500"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.25 }}
                />
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <CartNavLink initialCount={cartItemCount} />
          <AuthNav />
        </div>
      </div>
    </motion.header>
  );
}
