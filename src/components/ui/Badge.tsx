import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type BadgeVariant = "milo" | "clinical";

export interface BadgeProps extends ComponentPropsWithoutRef<"span"> {
  variant?: BadgeVariant;
}

const variantClass: Record<BadgeVariant, string> = {
  milo: "badge-milo",
  clinical: "inline-flex items-center rounded-pill bg-clinical-100 px-3 py-1 text-sm font-medium text-clinical-700",
};

export function Badge({
  variant = "milo",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={cn(variantClass[variant], className)} {...props}>
      {children}
    </span>
  );
}
