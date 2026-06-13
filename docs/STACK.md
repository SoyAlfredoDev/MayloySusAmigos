# Stack definitivo — Mailo y sus Amigos

## Resumen

| Capa | Tecnología |
|------|------------|
| Frontend / API | **Next.js 16** (App Router, Server Components, Server Actions) |
| Base de datos | **PostgreSQL** en **Neon** (serverless) |
| ORM | **Prisma** |
| Pagos | **Mercado Pago** y/o **Stripe** |
| Estilos | Tailwind CSS v4 |
| Animaciones | Framer Motion |
| Despliegue | Vercel |

No se usa WooCommerce, Medusa ni Transbank.

---

## Por qué este stack

- **Un solo proyecto** — tienda, citas, cuenta y admin en la misma app Next.js.
- **Neon + Prisma** — Postgres gestionado, migraciones versionadas y tipos seguros en TypeScript.
- **Mercado Pago + Stripe** — cobertura local (Chile/LATAM) e internacional sin depender de un CMS externo.
- **Vercel** — despliegue alineado con Next.js, previews por PR y variables de entorno por ambiente.

---

## Módulos y backend

| Módulo | Datos | Pagos |
|--------|-------|-------|
| Pet shop (catálogo, carrito, pedidos) | Prisma + Neon | Mercado Pago / Stripe |
| Veterinaria (citas) | Prisma + Neon | — (Fase 1) |
| Peluquería (citas) | Prisma + Neon | — (Fase 1) |
| Cuenta / mascotas | Prisma + Neon | — |

Los servicios de agendamiento pueden integrar pagos en fases posteriores con las mismas pasarelas.

---

## Variables de entorno

Ver `.env.example`. Mínimo para desarrollo:

- `DATABASE_URL` / `DIRECT_URL` — Neon
- `NEXTAUTH_*` — autenticación (Fase 1)
- `STRIPE_*` — cuando se active checkout con Stripe
- `MERCADOPAGO_*` — cuando se active checkout con Mercado Pago

---

## Documentación relacionada

- [ARCHITECTURE.md](./ARCHITECTURE.md) — estructura de carpetas y flujos
- [ROADMAP.md](./ROADMAP.md) — fases de implementación
- [COMPONENT_ARCHITECTURE.md](./COMPONENT_ARCHITECTURE.md) — convenciones de UI
