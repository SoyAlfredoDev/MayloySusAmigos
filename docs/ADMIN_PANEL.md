# Panel administrativo — Mailo y sus Amigos

## Rutas

| Módulo | Ruta | Gestión |
|--------|------|---------|
| Pet shop | `/admin/tienda` | Productos, pedidos, inventario |
| Veterinaria | `/admin/veterinaria` | Citas, profesionales, horarios |
| Peluquería | `/admin/peluqueria` | Citas, peluqueros, servicios |

`/admin` redirige a `/admin/tienda`.

## Navegación

El layout de `/admin/*` incluye:

- **Header** — logo, título del panel y enlace al sitio público
- **Nav lateral** (desktop) / **tabs horizontales** (móvil) — cambio entre Tienda, Veterinaria y Peluquería

## Estado actual

Placeholders por módulo. La lógica real se implementará con **Prisma + Neon** en fases posteriores.

## Archivos clave

```
src/app/admin/
├── layout.tsx
├── page.tsx              # redirect → /admin/tienda
├── tienda/page.tsx
├── veterinaria/page.tsx
└── peluqueria/page.tsx

src/components/admin/
├── AdminHeader.tsx
├── AdminNav.tsx
├── AdminPageHeader.tsx
└── AdminSectionGrid.tsx

src/config/admin.ts       # módulos y rutas
```
