# Mailo y sus Amigos

Plataforma web para clínica veterinaria, pet shop y peluquería canina en Chile.

## Stack

- **Next.js 16** — App Router, TypeScript, Server Components
- **PostgreSQL (Neon)** + **Prisma** — datos de citas, mascotas, cuenta y tienda
- **Mercado Pago / Stripe** — pagos del pet shop (Fase 2)
- **Tailwind CSS v4** + **Framer Motion**

Documentación: [docs/STACK.md](./docs/STACK.md)

## Desarrollo

```bash
cp .env.example .env.local
# Configura DATABASE_URL con tu proyecto Neon

npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Base de datos

```bash
cp .env.example .env
# Pega credenciales de un proyecto/rama Neon DEDICADO a Mailo (ver docs/NEON.md)

npm run db:migrate    # primera vez: crea tablas en la base nueva
npm run db:studio     # interfaz visual
```

**No uses la misma base de otro proyecto activo.** Crea un proyecto nuevo en Neon o una rama `mailo-dev`.

## Build

```bash
npm run build
npm start
```

## Estructura

| Ruta | Módulo |
|------|--------|
| `/` | Landing |
| `/veterinaria` | Agendamiento veterinaria |
| `/peluqueria` | Agendamiento peluquería |
| `/tienda` | Pet shop |
| `/cuenta/*` | Panel del cliente |
| `/admin` | Panel administrativo (futuro) |

Más detalle en [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) y [docs/ROADMAP.md](./docs/ROADMAP.md).
