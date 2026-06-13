import { Card } from "@/components/ui/Card";

export interface AdminSection {
  title: string;
  description: string;
}

export interface AdminSectionGridProps {
  sections: AdminSection[];
}

export function AdminSectionGrid({ sections }: AdminSectionGridProps) {
  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2">
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
