# Autenticación y mascotas compartidas

## Seguridad (Chile — Ley 19.628)

- Contraseñas hasheadas con **bcrypt** (cost 12). Nunca se almacenan en texto plano.
- Sesión JWT vía **NextAuth** (`NEXTAUTH_SECRET` obligatorio en producción).
- Consentimiento explícito de datos personales al registrarse (`privacyConsentAt`).
- Marketing opcional y separado (`marketingConsent`).

## Relación usuario ↔ mascota (muchos a muchos)

Tabla `pet_memberships`:

| Campo | Uso |
|-------|-----|
| `userId` + `petId` | Clave única — un usuario vinculado a una mascota |
| `role` | `OWNER` (tutor principal) o `CAREGIVER` (co-tutor) |
| `isPrimary` | Tutor principal de la mascota |

Un usuario puede tener varias mascotas. Una mascota puede tener varios tutores (invitar por correo en `/cuenta/mascotas`).

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/cuenta/registro` | Crear cuenta |
| `/cuenta/ingresar` | Iniciar sesión |
| `/cuenta/mascotas` | CRUD mascotas + invitar co-tutor |
| `/cuenta/perfil` | Datos de cuenta |

## Variables `.env`

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=genera-un-secreto-largo-y-aleatorio
```

En Vercel: `NEXTAUTH_URL=https://mayloy-sus-amigos.vercel.app`

## Reserva sin cuenta

El wizard permite **continuar sin contraseña** (datos mínimos + cookie). Al registrarse después, las mascotas creadas quedan vinculadas si usan el mismo correo.
