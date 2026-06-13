import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export interface AdminSection {
  title: string;
  description: string;
}

export interface AdminSectionGridProps {
  sections: AdminSection[];
  className?: string;
}

export function AdminSectionGrid({ sections, className }: AdminSectionGridProps) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2", className)}>
      {sections.map((section) => (
        <Card key={section.title} className="bg-surface">
          <p className="font-semibold text-ink">{section.title}</p>
          <p className="mt-2 text-sm text-ink-muted">{section.description}</p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink-light">
            Próximamente
          </p>
        </Card>
      ))}
    </div>
  );
}
