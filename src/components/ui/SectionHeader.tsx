import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface SectionHeaderProps {
  badge?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({
  badge,
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-4",
        className,
      )}
    >
      <div>
        {badge}
        <h1 className={cn("section-title", badge && "mt-3", !badge && "mt-0")}>
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-ink-muted">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
