import { Badge } from "@/components/ui/Badge";
import type { AdminModule } from "@/config/admin";

export interface AdminPageHeaderProps {
  module: AdminModule;
}

export function AdminPageHeader({ module }: AdminPageHeaderProps) {
  return (
    <div>
      <Badge>{module.badge}</Badge>
      <h1 className="section-title mt-4">{module.label}</h1>
      <p className="mt-2 max-w-2xl text-ink-muted">{module.description}</p>
    </div>
  );
}
