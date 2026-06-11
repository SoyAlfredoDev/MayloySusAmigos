# Arquitectura de Componentes — Mailo y sus Amigos

Convención obligatoria para todo desarrollo nuevo o modificación de UI.

---

## Principios

1. **Páginas delgadas** — `app/**/page.tsx` solo orquesta datos (fetch, params) y compone componentes. Sin markup repetido.
2. **Dominio primero** — cada feature vive en su carpeta (`shop`, `booking`, `account`).
3. **Reutilización en capas** — de abajo hacia arriba: `ui` → `shared` → dominio → página.
4. **Booking compartido** — veterinaria y peluquería comparten `booking/shared/`; lo específico va en `veterinary/` o `grooming/`.
5. **Sin cruces entre dominios** — `shop` no importa de `booking/veterinary`; `veterinary` no importa de `grooming`.

---

## Estructura de carpetas

```
src/components/
├── ui/                         # Átomos — sin lógica de negocio ni imports de dominio
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── SectionHeader.tsx
│   ├── StepList.tsx
│   ├── EmptyState.tsx
│   └── Alert.tsx
│
├── shared/                     # Layout y navegación transversal
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── SiteShell.tsx           # Header + main + Footer
│   ├── PageContainer.tsx       # max-width + padding estándar
│   ├── PageTransition.tsx
│   └── AccountSidebar.tsx
│
├── shop/                       # Dominio: Pet Shop (Medusa)
│   ├── ShopPageHeader.tsx
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   └── MedusaStatusBanner.tsx
│
├── booking/
│   ├── shared/                 # Compartido vet + peluquería
│   │   ├── BookingIntro.tsx
│   │   └── BookingStepList.tsx
│   ├── veterinary/             # Solo veterinaria
│   │   └── veterinary.config.ts
│   └── grooming/               # Solo peluquería
│       └── grooming.config.ts
│
├── account/                    # Panel Pet Parent
│   └── AccountPageHeader.tsx
│
└── marketing/                  # Landing pública
    └── ServiceModuleCard.tsx
```

---

## Reglas de importación

```
ui          →  (solo React, lib/utils)
shared      →  ui, config/site
shop        →  ui, shared, lib/medusa
booking/*   →  ui, shared, lib/booking (futuro)
account     →  ui, shared
marketing   →  ui, shared
app/pages   →  cualquier componente + lib + actions
```

**Prohibido:**
- `ui` importando de `shop`, `booking`, etc.
- `booking/veterinary` importando de `booking/grooming` (y viceversa)
- Lógica de fetch de Medusa dentro de componentes `ui` o `booking`

---

## Cuándo crear un componente nuevo

| Situación | Ubicación |
|-----------|-----------|
| Botón, tarjeta, badge genérico | `ui/` |
| Header, layout, contenedor de página | `shared/` |
| Tarjeta de producto, grid tienda | `shop/` |
| Paso de wizard compartido (vet + pelu) | `booking/shared/` |
| Selector de especialidad (solo vet) | `booking/veterinary/` |
| Selector de tamaño mascota (solo pelu) | `booking/grooming/` |
| Título de sección en cuenta | `account/` |

**Regla práctica:** si se usa en 2+ dominios → sube a `ui` o `shared`. Si solo en un dominio → carpeta del dominio.

---

## Convenciones de código

- **Archivos:** PascalCase (`ProductCard.tsx`)
- **Exports:** barrel `index.ts` por carpeta
- **Props:** interface con sufijo `Props` (`ProductCardProps`)
- **Client vs Server:** `"use client"` solo si hay estado, eventos o Motion
- **Estilos:** utilidades de marca (`btn-primary`, `card-milo`) o `cn()` de `lib/utils`

---

## Layouts de rutas

Los route groups usan `SiteShell` con variante de fondo:

| Route group | Variante `SiteShell` |
|-------------|----------------------|
| `(marketing)` | `marketing` — `bg-paw-pattern` |
| `(shop)` | `shop` — `bg-surface-soft` |
| `(booking)` | `booking` — `bg-surface` |
| `(account)` | Header + `AccountSidebar` (sin Footer) |

---

## Dominios y backends

| Dominio | Carpeta componentes | Backend |
|---------|---------------------|---------|
| Tienda | `shop/` | Medusa |
| Veterinaria | `booking/veterinary/` + `booking/shared/` | Prisma/Neon |
| Peluquería | `booking/grooming/` + `booking/shared/` | Prisma/Neon |
| Cuenta | `account/` | Prisma + Medusa (pedidos) |
