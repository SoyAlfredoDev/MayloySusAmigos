# Neon — base de datos para Mailo y sus Amigos

## Importante

**No uses la misma base de datos de otro proyecto activo.**  
Cada app debe tener su propio proyecto (o rama) en Neon. Así evitas conflictos de tablas y no arriesgas datos ajenos.

Este proyecto **nunca** debe ejecutar `prisma migrate reset` ni `db push --accept-data-loss` contra una base compartida.

> **Revertido (jun 2026):** Las tablas Mailo (`users`, `pets`, `products`, etc.) fueron eliminadas de la base `ep-empty-fog-acttx63w`. La otra app (`Booking`, `Room`, `PendingCheckout`, `SpecialRequest`) quedó intacta. Mailo aún **no** tiene base propia — créala antes de `npm run db:migrate`.

---

## Opción recomendada: nuevo proyecto en Neon

1. Entra a [console.neon.tech](https://console.neon.tech)
2. **New Project**
3. Nombre sugerido: `mailo-y-sus-amigos`
4. Región: **South America (São Paulo)** — `sa-east-1` (cerca de Chile)
5. Crea el proyecto

Neon te dará credenciales nuevas, distintas a las de tu otro proyecto.

---

## Opción alternativa: rama (branch) en el mismo proyecto

Si quieres quedarte en el mismo proyecto Neon (sin tocar la rama `main` activa):

1. En el panel del proyecto → **Branches**
2. **Create branch** → nombre: `mailo-dev`
3. Esa rama tiene su **propia URL de conexión** (host distinto)
4. Usa **solo** las credenciales de la rama `mailo-dev` en este repo

La rama `main` con tu app anterior sigue intacta.

---

## Vercel Storage → Neon (prefijo obligatorio)

Si Vercel te pide **Custom Prefix**, usa:

```
MAILO
```

Vercel creará automáticamente variables como:

- `MAILO_POSTGRES_URL` — pooled (la app las usa en runtime)
- `MAILO_POSTGRES_URL_NON_POOLING` — directo (migraciones Prisma)
- `MAILO_POSTGRES_PRISMA_URL` — alternativa pooled

El código ya lee esas variables; **no necesitas** renombrarlas a `DATABASE_URL` en Vercel.

En local, puedes pegar en `.env` cualquiera de estas dos formas:

```env
# Forma A — estándar
DATABASE_URL=...
DIRECT_URL=...

# Forma B — prefijo Vercel (copia desde Vercel → Storage → .env.local)
MAILO_POSTGRES_URL=...
MAILO_POSTGRES_URL_NON_POOLING=...
```

---

## Configurar este repo

1. Copia las credenciales de la **nueva** base (proyecto o rama):

```bash
cp .env.example .env
```

2. En `.env`, pega **solo** las URLs del proyecto/rama Mailo:

```env
# Pooled — app en runtime (Prisma adapter + Next.js)
DATABASE_URL=postgresql://USER:PASSWORD@ep-NUEVO-xxx-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require

# Directo — migraciones Prisma (sin pooler)
DIRECT_URL=postgresql://USER:PASSWORD@ep-NUEVO-xxx.sa-east-1.aws.neon.tech/neondb?sslmode=require
```

En el dashboard de Neon:
- **Connection string → Pooled** → `DATABASE_URL`
- **Connection string → Direct** → `DIRECT_URL`

3. Crea las tablas de Mailo (solo en la base nueva):

```bash
npm run db:migrate
```

La primera vez pedirá un nombre de migración; usa por ejemplo: `init_mailo`

4. Verifica:

```bash
npm run db:studio
```

Deberías ver tablas como `users`, `pets`, `categories`, `products`, etc.

---

## Comandos seguros

| Comando | Qué hace |
|---------|----------|
| `npm run db:migrate` | Crea/aplica migraciones en la DB del `.env` |
| `npm run db:push` | Sincroniza esquema sin historial (solo dev) |
| `npm run db:studio` | UI para ver datos |
| `npm run db:generate` | Regenera el cliente Prisma |

## Comandos prohibidos en una DB ajena o compartida

- `prisma migrate reset` — **borra todas las tablas**
- `prisma db push --accept-data-loss` — puede **eliminar tablas** que no estén en el schema

---

## Vercel (producción)

En el proyecto de Vercel de **Mailo**, agrega las variables de la **base nueva**:

- `DATABASE_URL` (pooled)
- `DIRECT_URL` (direct, para migraciones)

No reutilices las variables del otro proyecto en Vercel.

### Crear tablas en producción (obligatorio una vez)

Si `/api/health/db` responde `The table public.categories does not exist`, la base de Vercel **no tiene migraciones aplicadas**.

**Opción A — misma base que local (recomendado):**  
Copia en Vercel las mismas `DATABASE_URL` y `DIRECT_URL` de tu `.env` local (`ep-cool-haze-...`). Esa base ya tiene tablas y seed.

**Opción B — base nueva de Vercel/Neon:**  
Desde tu máquina, con las URLs que muestra Vercel → Storage → `.env.local`:

```bash
# Usa DIRECT_URL de Vercel (sin pooler) para migrar
export DIRECT_URL="postgresql://...@ep-xxx...neon.tech/neondb?sslmode=require"
export DATABASE_URL="postgresql://...@ep-xxx-pooler...neon.tech/neondb?sslmode=require"

npm run db:migrate:deploy
npm run db:seed
```

Luego verifica: `https://tu-dominio.vercel.app/api/health/db` → debe mostrar `"ok": true` y `"products": 9`.

---

## Resumen

| Proyecto | Base Neon |
|----------|-----------|
| Tu app anterior (activa) | Proyecto/rama original — **no tocar** |
| Mailo y sus Amigos | **Proyecto nuevo** o **rama `mailo-dev`** |

Cuando tengas las nuevas credenciales en `.env`, avisa y corremos `npm run db:migrate` solo contra esa base vacía.
