import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface EmptyStateProps {
  message: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ message, action, className }: EmptyStateProps) {
  return (
    <Card className={cn("mt-8 text-center", className)}>
      <p className="text-ink-muted">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </Card>
  );
}
