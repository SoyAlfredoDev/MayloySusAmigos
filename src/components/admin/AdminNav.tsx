"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminModules, isAdminModuleActive } from "@/config/admin";
import { cn } from "@/lib/utils";

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Módulos del panel admin"
      className="flex flex-1 items-center justify-center overflow-x-auto px-2"
    >
      <ul className="flex items-center gap-1">
        {adminModules.map((module) => {
          const isActive = isAdminModuleActive(pathname, module);

          return (
            <li key={module.id} className="shrink-0">
              <Link
                href={module.href}
                className={cn(
                  "inline-flex rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-milo-600 text-white shadow-sm"
                    : "text-ink-muted hover:bg-milo-50 hover:text-milo-700",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {module.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
