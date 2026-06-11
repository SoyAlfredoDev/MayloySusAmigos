import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type AlertVariant = "info" | "warning" | "error";

export interface AlertProps {
  title: string;
  children?: ReactNode;
  variant?: AlertVariant;
  className?: string;
}

const variantClass: Record<AlertVariant, string> = {
  info: "border-milo-200 bg-milo-50",
  warning: "border-clinical-200 bg-clinical-50",
  error: "border-clinical-300 bg-clinical-50",
};

const titleClass: Record<AlertVariant, string> = {
  info: "text-milo-800",
  warning: "text-clinical-700",
  error: "text-clinical-700",
};

export function Alert({
  title,
  children,
  variant = "info",
  className,
}: AlertProps) {
  return (
    <Card className={cn("mt-8", variantClass[variant], className)}>
      <p className={cn("font-semibold", titleClass[variant])}>{title}</p>
      {children && (
        <div className="mt-2 text-sm text-ink-muted">{children}</div>
      )}
    </Card>
  );
}
