# Guía de estilos — Mailo y sus Amigos

Identidad visual extraída del logotipo: amigable, profesional, limpia y moderna, con un toque cartoon/pop sutil orientado al cuidado animal.

---

## Paleta de colores

### Primario — Turquesa / Cian (`milo-*`)

Transmite frescura, higiene y cuidado veterinario. Uso en fondos destacados, headers, badges informativos y botones secundarios.

| Token | Hex | Uso |
|-------|-----|-----|
| `milo-500` | `#15a1b3` | Color principal de marca |
| `milo-600` | `#0fa7bf` | Variante logo / hover |
| `milo-100` | `#b3e8ef` | Fondos suaves, badges |
| `milo-800` | `#096170` | Footer, secciones oscuras |

### Acento — Rojo clínico (`clinical-*`)

Extraído de la jeringa y cruz médica. Uso en CTAs críticos, alertas y acciones de alta prioridad.

| Token | Hex | Uso |
|-------|-----|-----|
| `clinical-500` | `#e63946` | **Agendar Cita**, confirmaciones |
| `clinical-600` | `#c92d39` | Hover de CTA |
| `clinical-100` | `#fde0e3` | Alertas suaves |

### Neutros

| Token | Hex | Uso |
|-------|-----|-----|
| `surface` | `#ffffff` | Fondos limpios |
| `surface-soft` | `#f8fafb` | Fondo general de página |
| `ink` | `#1a1a2e` | Tipografía principal, contornos pop |
| `ink-muted` | `#4a4a68` | Texto secundario |

---

## Tipografía

- **Fuente:** Nunito (Google Fonts) — redondeada, amigable, legible.
- **Pesos:** 400 (cuerpo), 600 (subtítulos), 700–800 (títulos).
- **Escala:**
  - H1: `text-4xl md:text-5xl font-extrabold`
  - H2: `text-2xl md:text-3xl font-bold` (`.section-title`)
  - Cuerpo: `text-base text-ink-muted`
  - Badge: `text-sm font-medium`

---

## Componentes base (utilidades CSS)

```css
.btn-primary   /* Turquesa — acciones estándar (Ver Tienda) */
.btn-cta       /* Rojo clínico — CTAs críticos (Agendar Cita) */
.card-milo     /* Tarjeta con borde suave y sombra de marca */
.badge-milo    /* Etiqueta informativa turquesa */
.section-title /* Título de sección */
```

---

## Formas y estética

- **Border radius:** `rounded-milo` (1.25rem) para tarjetas; `rounded-pill` para botones.
- **Bordes pop:** `border-2 border-ink/10` en tarjetas; `shadow-pop` en CTAs (sombra sólida tipo cartoon).
- **Patrón decorativo:** `bg-paw-pattern` — huellas sutiles en fondos de marketing.
- **Ilustraciones:** Bordes definidos, formas circulares, detalles lúdicos (huellas, iconos de mascotas).

---

## Motion (Framer Motion)

| Contexto | Animación |
|----------|-----------|
| Cambio de página | `PageTransition` — fade + slide up (350ms) |
| Hover en cards | `shadow-card` → `shadow-card-hover` |
| Botones | `active:scale-[0.98]` |
| Modales / drawers | spring suave (stiffness: 300, damping: 30) |

Evitar animaciones excesivas en flujos de checkout y agendamiento (accesibilidad y claridad).

---

## Accesibilidad

- Contraste mínimo WCAG AA en texto (`ink` sobre `surface`).
- CTAs con texto descriptivo (no solo color).
- Focus visible en elementos interactivos.
- `lang="es-CL"` en el documento raíz.

---

## Ejemplos de uso

```tsx
// CTA principal de agendamiento
<button className="btn-cta">Agendar Cita Veterinaria</button>

// Acción secundaria e-commerce
<button className="btn-primary">Agregar al carrito</button>

// Tarjeta de producto o servicio
<div className="card-milo">...</div>

// Etiqueta de módulo
<span className="badge-milo">Veterinaria</span>
```
