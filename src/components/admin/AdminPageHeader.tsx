import type { AdminModule } from "@/config/admin";

export interface AdminPageHeaderProps {
  module: AdminModule;
}

export function AdminPageHeader({ module }: AdminPageHeaderProps) {
  return <h1 className="section-title">{module.label}</h1>;
}
