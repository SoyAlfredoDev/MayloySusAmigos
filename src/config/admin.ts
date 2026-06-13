export type AdminModuleId =
  | "tienda"
  | "veterinaria"
  | "peluqueria"
  | "mascotas"
  | "clientes";

export type AdminModule = {
  id: AdminModuleId;
  label: string;
  href: `/admin/${AdminModuleId}`;
};

export const adminModules: AdminModule[] = [
  { id: "tienda", label: "Tienda", href: "/admin/tienda" },
  { id: "veterinaria", label: "Veterinaria", href: "/admin/veterinaria" },
  { id: "peluqueria", label: "Peluquería", href: "/admin/peluqueria" },
  { id: "mascotas", label: "Mascotas", href: "/admin/mascotas" },
  { id: "clientes", label: "Clientes", href: "/admin/clientes" },
] as const;

export function getAdminModule(id: AdminModuleId): AdminModule {
  const module = adminModules.find((item) => item.id === id);
  if (!module) throw new Error(`Admin module not found: ${id}`);
  return module;
}

export function isAdminModuleActive(
  pathname: string,
  module: AdminModule,
): boolean {
  return pathname === module.href || pathname.startsWith(`${module.href}/`);
}
