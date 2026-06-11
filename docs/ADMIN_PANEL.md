# Panel Administrativo de Productos

## Respuesta corta

**Sí, el sistema ya cuenta con panel administrativo.** No está en `/tienda` de la app Mailo, sino en **Medusa Admin**, el dashboard profesional incluido con el backend de e-commerce.

| Acción | Dónde |
|--------|-------|
| Ver productos | Medusa Admin → Products |
| Crear productos | Medusa Admin → Products → Create |
| Editar productos | Medusa Admin → Products → [producto] |
| Publicar en la tienda | Cambiar estado a **Published** + vincular al Sales Channel |
| Gestionar stock | Medusa Admin → Inventory |
| Categorías y precios | Medusa Admin → Products / Pricing |

---

## URLs de acceso

| Entorno | Panel Admin | Tienda pública |
|---------|-------------|----------------|
| Local | http://localhost:9000/app | http://localhost:3000/tienda |
| Medusa Cloud | https://{tu-proyecto}.medusajs.app/app | https://{tu-proyecto}.medusajs.site o tu app Vercel |

Desde la app Mailo también puedes ir a **http://localhost:3000/admin** (página puente con enlace directo).

---

## Configuración local (primera vez)

### 1. Base de datos y Redis

```bash
# Levantar Postgres + Redis con Docker
docker compose up -d
```

### 2. Variables del backend Medusa

```bash
cp medusa-backend/apps/backend/.env.template medusa-backend/apps/backend/.env
```

Asegúrate de tener:

```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/mailo-medusa
REDIS_URL=redis://localhost:6379
```

### 3. Migrar y crear usuario admin

```bash
npm run medusa:migrate
npm run medusa:admin-user
```

Credenciales por defecto (cámbialas en producción):

- **Email:** `admin@mailoyusamigos.cl`
- **Contraseña:** `MailoAdmin2026!`

### 4. Arrancar backend

```bash
npm run medusa:backend
```

Abre http://localhost:9000/app e inicia sesión.

### 5. Publishable API Key

En Admin → **Settings → Publishable API Keys**, copia la key a tu `.env`:

```
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
```

---

## Cómo publicar un producto en la tienda

1. **Products → Create product**
2. Completa: título, descripción, imágenes, variantes, precio en **CLP**
3. En **Status**, selecciona **Published** (no Draft)
4. Asigna el producto al **Sales Channel** "Default Sales Channel"
5. Configura inventario en la variante
6. Guarda

El producto aparecerá automáticamente en `/tienda` de la app Mailo (vía Medusa SDK).

> Los productos en estado **Draft** no se muestran en el storefront.

---

## Arquitectura

```
┌─────────────────────────┐     ┌──────────────────────────┐
│  Medusa Admin           │     │  App Mailo (/tienda)      │
│  localhost:9000/app     │────▶│  Solo lectura (catálogo) │
│  CRUD productos         │ API │  Medusa JS SDK           │
└─────────────────────────┘     └──────────────────────────┘
         │
         ▼
   PostgreSQL (productos, pedidos, inventario)
```

No duplicamos un panel custom en Next.js: Medusa Admin ya incluye catálogo, inventario, pedidos, promociones y regiones.

---

## Medusa Cloud (producción)

Al desplegar en [Medusa Cloud](https://cloud.medusajs.com), el Admin queda en:

`https://{subdomain}.medusajs.app/app`

Configura el usuario inicial durante la creación del proyecto en Cloud.
