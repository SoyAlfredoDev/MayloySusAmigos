export const adminConfig = {
  /** URL del Medusa Admin (gestión de productos, pedidos, inventario) */
  medusaAdminUrl:
    process.env.NEXT_PUBLIC_MEDUSA_ADMIN_URL ?? "http://localhost:9000/app",
  medusaBackendUrl:
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000",
  defaultAdminEmail: "admin@mailoyusamigos.cl",
} as const;
