# Roadmap de desarrollo — Mailo y sus Amigos

Plan por fases priorizando valor de negocio, time-to-market y dependencias técnicas.

---

## Fase 0 — Fundación ✅ (actual)

**Objetivo:** Base técnica lista para iterar.

- [x] Proyecto Next.js (App Router, TypeScript, Tailwind)
- [x] Estructura de carpetas por módulos
- [x] Esquema Prisma + Neon
- [x] Design tokens y guía de estilos
- [x] Layouts y rutas placeholder
- [ ] Conectar Neon y ejecutar migraciones
- [ ] Configurar Vercel + variables de entorno

**Entregable:** Repo desplegado con landing y navegación entre módulos.

---

## Fase 1 — MVP Agendamiento + Panel Pet Parent (4–6 semanas)

**Objetivo:** Clientes pueden registrarse, registrar mascotas y agendar citas.

### Backend
- Autenticación (NextAuth o Clerk) con email/password
- CRUD de mascotas e historial clínico básico
- Seed de profesionales, especialidades y servicios
- API/Server Actions: listar slots disponibles, crear/cancelar citas
- Constraint `@@unique([professionalId, scheduledAt])` para evitar doble reserva

### Frontend
- Flujo wizard veterinaria: mascota → especialidad → profesional → calendario → confirmar
- Flujo wizard peluquería: mascota/tamaño → servicio → peluquero → horario → confirmar
- Panel `/cuenta/*`: perfil, mascotas, citas activas
- Emails de confirmación (Resend / SendGrid)

### Criterio de éxito
- Un cliente agenda una cita vet. y una de peluquería sin conflictos de horario.
- Staff puede ver citas del día (panel admin básico — opcional en Fase 1).

---

## Fase 2 — E-Commerce Pet Shop (4–5 semanas)

**Objetivo:** Venta online funcional con pago en Chile.

### Backend
- CRUD productos, categorías, marcas (panel admin)
- Carrito persistente por usuario
- Checkout con dirección de envío (comunas Chile)
- Integración Transbank Webpay Plus (ambiente integración → producción)
- Webhook de confirmación de pago → actualizar `Order.status`

### Frontend
- Catálogo SSR con filtros (tipo mascota, marca, categoría)
- Página de detalle con SEO (`generateMetadata`)
- Carrito y checkout
- `/cuenta/pedidos` con historial y tracking básico

### Criterio de éxito
- Compra end-to-end con Webpay en integración.
- Stock se decrementa al confirmar pago.

---

## Fase 3 — Pulido UX, SEO y rendimiento (2–3 semanas)

- Optimización de imágenes (Next/Image + CDN Vercel)
- ISR/revalidate en catálogo
- Microinteracciones Motion en todo el sitio
- Ilustraciones e iconografía de marca
- Páginas legales (términos, privacidad — Ley 19.628 Chile)
- Google Analytics / Meta Pixel (si aplica)

---

## Fase 4 — Panel Admin y operaciones (3–4 semanas)

- Dashboard staff: agenda del día, gestión de citas
- Gestión de inventario y pedidos
- Configuración de horarios y bloqueos de profesionales
- Reportes básicos (ventas, citas por servicio)

---

## Fase 5 — Expansión (futuro)

- Notificaciones push / WhatsApp para recordatorios de citas
- Programa de fidelización / cupones
- Suscripciones de alimento (pedido recurrente)
- App móvil (React Native o PWA)
- Multi-sucursal

---

## Priorización recomendada

```
Fase 0 → Fase 1 (Agendamiento) → Fase 2 (E-commerce) → Fase 3 (Pulido) → Fase 4 (Admin)
```

**Por qué agendamiento primero:** Genera flujo recurrente de clientes, valida el registro de mascotas (necesario para ambos módulos) y es el diferenciador frente a un pet shop genérico.

---

## Comandos útiles

```bash
# Desarrollo
npm run dev

# Base de datos
cp .env.example .env
npx prisma migrate dev --name init
npx prisma db seed   # (cuando se agregue seed)

# Producción
npx prisma migrate deploy
npm run build
```
