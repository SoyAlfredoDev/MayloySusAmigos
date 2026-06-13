"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminModules } from "@/config/admin";
import { cn } from "@/lib/utils";

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Módulos del panel admin" className="w-full md:w-56 md:shrink-0">
      <div className="card-milo sticky top-24 p-2 md:p-4">
        <p className="mb-3 hidden px-3 text-sm font-bold uppercase tracking-wide text-ink-light md:block">
          Módulos
        </p>

        <div className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0">
          {adminModules.map((module) => {
            const isActive = pathname === module.href;

            return (
              <Link
                key={module.id}
                href={module.href}
                className={cn(
                  "shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors md:px-3",
                  isActive
                    ? "bg-milo-600 text-white shadow-sm"
                    : "text-ink-muted hover:bg-milo-50 hover:text-milo-700",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {module.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
