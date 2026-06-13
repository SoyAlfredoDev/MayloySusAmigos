"use client";

import { useEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface AdminModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  size?: "md" | "lg";
}

export function AdminModal({
  open,
  title,
  onClose,
  children,
  size = "md",
}: AdminModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cerrar modal"
        className="absolute inset-0 bg-ink/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
        className={cn(
          "relative flex max-h-[90vh] w-full flex-col rounded-2xl bg-surface shadow-2xl",
          size === "lg" ? "max-w-3xl" : "max-w-xl",
        )}
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-ink/10 px-6 py-4">
          <h2 id="admin-modal-title" className="text-lg font-bold text-ink">
            {title}
          </h2>
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </header>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
