"use client";

import { useEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";

export interface AdminSidePanelProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
}

export function AdminSidePanel({
  open,
  title,
  description,
  onClose,
  children,
}: AdminSidePanelProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Cerrar panel"
        className="absolute inset-0 bg-ink/30"
        onClick={onClose}
      />
      <aside className="relative flex h-full w-full max-w-xl flex-col bg-surface shadow-2xl">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-ink/10 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-ink">{title}</h2>
            {description && (
              <p className="mt-1 text-sm text-ink-muted">{description}</p>
            )}
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </aside>
    </div>
  );
}
