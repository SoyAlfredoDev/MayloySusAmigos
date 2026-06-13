export type AdminModuleId = "tienda" | "veterinaria" | "peluqueria";

export type AdminModule = {
  id: AdminModuleId;
  label: string;
  href: `/admin/${AdminModuleId}`;
  description: string;
  badge: string;
};

export const adminModules: AdminModule[] = [
  {
    id: "tienda",
    label: "Tienda",
    href: "/admin/tienda",
    description: "Catálogo, pedidos, stock y categorías del pet shop.",
    badge: "Pet Shop",
  },
  {
    id: "veterinaria",
    label: "Veterinaria",
    href: "/admin/veterinaria",
    description: "Citas, profesionales, especialidades y horarios clínicos.",
    badge: "Clínica",
  },
  {
    id: "peluqueria",
    label: "Peluquería",
    href: "/admin/peluqueria",
    description: "Citas, peluqueros, servicios y disponibilidad.",
    badge: "Grooming",
  },
] as const;

export function getAdminModule(id: AdminModuleId): AdminModule {
  const module = adminModules.find((item) => item.id === id);
  if (!module) throw new Error(`Admin module not found: ${id}`);
  return module;
}
