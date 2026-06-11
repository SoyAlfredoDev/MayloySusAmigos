# Medusa E-Commerce + Medusa Cloud — Mailo y sus Amigos

Integración de [Medusa v2](https://docs.medusajs.com/start) como motor de e-commerce headless, desplegado en [Medusa Cloud](https://docs.medusajs.com/cloud/projects).

## Arquitectura

```
Mailo y Sus Amigos/
├── src/                          → App principal (marketing, booking, cuenta)
│   └── app/(shop)/tienda/        → Catálogo conectado a Medusa JS SDK
├── medusa-backend/               → Monorepo Medusa (Turbo)
│   ├── apps/backend/             → API + Admin (puerto 9000)
│   └── apps/storefront/          → Storefront Next.js oficial (puerto 8000)
└── docs/MEDUSA_CLOUD.md          → Guía de despliegue
```

| Componente | URL local | Producción (Cloud) |
|------------|-----------|---------------------|
| Backend + Admin | `http://localhost:9000` | `https://{subdomain}.medusajs.app` |
| Storefront Medusa | `http://localhost:8000/cl` | `https://{subdomain}.medusajs.site` |
| App Mailo (Vercel) | `http://localhost:3000/tienda` | Tu dominio Vercel |

---

## Desarrollo local

### 1. Base de datos

Medusa Cloud provisiona Postgres automáticamente. En local necesitas PostgreSQL:

```bash
# Opción A: Docker
docker run -d --name mailo-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16

# Copiar env del backend
cp medusa-backend/apps/backend/.env.template medusa-backend/apps/backend/.env
# Editar DATABASE_URL=postgres://postgres:postgres@localhost:5432/mailo-medusa
```

### 2. Instalar dependencias (si el scaffold no terminó)

```bash
cd medusa-backend && npm install
```

### 3. Migrar y arrancar

```bash
cd medusa-backend/apps/backend
npx medusa db:migrate
npm run dev
```

En otra terminal — storefront Medusa:

```bash
cd medusa-backend
npm run storefront:dev
```

Copia el **Publishable API Key** del Admin (`Settings → Publishable API Keys`) a:
- `medusa-backend/apps/storefront/.env.local`
- `.env` raíz → `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`

### 4. App principal con catálogo Medusa

```bash
# En la raíz del proyecto
npm install
npm run dev
```

Visita `/tienda` — muestra productos desde Medusa si el backend está corriendo.

---

## Desplegar en Medusa Cloud

Documentación oficial: [Create Projects and Deploy to Cloud](https://docs.medusajs.com/cloud/projects)

### Paso 1 — Subir a GitHub

```bash
git add medusa-backend/
git commit -m "Add Medusa e-commerce monorepo"
git push origin main
```

### Paso 2 — Crear proyecto en Cloud

1. Regístrate en [cloud.medusajs.com](https://cloud.medusajs.com)
2. Autoriza la app de GitHub
3. **Create Project** → conecta tu repositorio
4. Configura:

| Campo | Valor |
|-------|-------|
| Project name | `mailo-petshop` |
| Subdomain | `mailo-petshop` (mín. 5 caracteres) |
| Region | `us-east-1` (o la más cercana a Chile) |
| **Project root directory** | `medusa-backend/apps/backend` |
| **Storefront root directory** | `medusa-backend/apps/storefront` |

5. **Initial user**: email y contraseña del admin
6. Click **Create**

Cloud provisiona automáticamente: **PostgreSQL**, **Redis** y **S3** (no necesitas configurarlos).

### Paso 3 — Variables de entorno post-deploy

Tras el deploy, en Cloud → Settings → Environment variables:

**Backend** (CORS — reemplaza con tus URLs reales):

```
STORE_CORS=https://mailo-petshop.medusajs.site,https://tu-app.vercel.app
AUTH_CORS=https://mailo-petshop.medusajs.app,https://mailo-petshop.medusajs.site,https://tu-app.vercel.app
ADMIN_CORS=https://mailo-petshop.medusajs.app
```

**Storefront**:

```
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://mailo-petshop.medusajs.app
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
NEXT_PUBLIC_DEFAULT_REGION=cl
NEXT_PUBLIC_BASE_URL=https://mailo-petshop.medusajs.site
```

**App Mailo (Vercel)**:

```
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://mailo-petshop.medusajs.app
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
NEXT_PUBLIC_MEDUSA_REGION=cl
```

### Panel Admin de productos

Medusa incluye un panel administrativo completo para crear, editar y publicar productos. No hace falta construir uno custom.

- **Local:** http://localhost:9000/app
- **Cloud:** https://{subdomain}.medusajs.app/app
- **Puente desde Mailo:** http://localhost:3000/admin

Guía detallada: [docs/ADMIN_PANEL.md](ADMIN_PANEL.md)

### Paso 4 — Obtener Publishable API Key

1. Abre `https://{subdomain}.medusajs.app/app` (Admin)
2. **Settings → Publishable API Keys**
3. Copia la key generada por el seed (`Default Publishable API Key`)

---

## Seed de datos (Chile)

El script `initial-data-seed.ts` está configurado para:

- Región **Chile** (`cl`) con moneda **CLP**
- Tienda **Mailo y sus Amigos**
- Categorías: Alimentos, Accesorios, Medicamentos, Higiene
- Envíos: Estándar ($4.990) y Express ($9.990 CLP)

---

## Próximos pasos

- [ ] Integrar **Transbank/Webpay** como payment provider en Medusa
- [ ] Sincronizar pedidos Medusa con `/cuenta/pedidos`
- [ ] Personalizar storefront Medusa con identidad visual completa
- [ ] Dominio custom en Cloud ([Custom Domains](https://docs.medusajs.com/cloud))
